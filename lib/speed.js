"use strict"

const got = require("got")
const mirrors = require("../available_mirrors.js")

module.exports = {
  mirror: mirror,
  canDownload: canDownload
}

async function timeConnection (url) {
  const start = Date.now()

  try {
    const response = await got.head(url)

    const results = {
      url: url,
      time: Date.now() - start
    }
    return results

  } catch (err) {
    // async.map will fail if any of the timeConnections returns an error, but
    // we only care that at least one succeeds; so fail silently
    console.error(err)
  }
  return false
}

// @param {Array} urls Can be an array of request objects or URL strings
// @param {Function] callback
async function faster (urls) {
  const speedTests = urls.map(async (value, index, array) => {
    return await timeConnection(value)
  })
  const results = await Promise.all(speedTests)

  const noResponses = results.every(value => {
    return !value
  })

  if (noResponses)
    return new Error("Bad response from all mirrors")

  const sorted = results.sort((a, b) => {
    return a.time - b.time
  })

  return sorted[0].url
}

async function mirror () {
  const urls = mirrors.map(value => {
    return `${value.baseUrl}/json.php?ids=1&fields=*`
  })

  try {
    const fastest = await faster(urls)
    return mirrors.filter(value => {
      return fastest.indexOf(value.baseUrl) === 0
    })[0].baseUrl
  } catch (err) {
    return err
  }
}

// @param {String, JSON} text
// @param {Function} callback
async function canDownload (text) {
  const md5 = text.md5 ? text.md5.toLowerCase() : text.toLowerCase()

  const urls = mirrors.filter(value => {
    return value.canDownloadDirect
  }).map(value => {
    return `${value.baseUrl}/get.php?md5=${md5}`
  })

  try {
    return await faster(urls)
  } catch (err) {
    return err
  }
}
