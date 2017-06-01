const request = require('request')
const async = require('async')
const mirrors = require('../available_mirrors.js')

module.exports = {
  mirror: mirror,
  canDownload: canDownload
}

function timeConnection (url, callback){
  const start = Date.now()

  request(url, (err, response, body) => {
    // async.map will fail if any of the timeConnections returns an
    // error, but we only care that at least one succeeds; so fail
    // silently
    if (err)
      return callback(null)

    else if (response.statusCode !== 200)
      return callback(null, false)

    else {
      const results = {
        url: url,
        time: Date.now() - start
      }
      return callback(null, results)
    }
  })
}

// @param {Array} urls Can be an array of request objects or URL strings
// @param {Function] callback
function faster (urls, callback) {
  return async.map(urls, timeConnection, (err, results) => {
    if (err)
      return callback(err)

    const noResponses = results.every(value => {
      return !value
    })

    if (noResponses)
      return callback(new Error('Bad response from all mirrors'))

    const sorted = results.sort((a, b) => {
      return a.time - b.time
    })

    return callback(null, sorted[0].url)
  })
}

function mirror (callback) {
  const urls = mirrors.map(value => {
    return { method: 'HEAD', url: `${value}/json.php?ids=1&fields=*` }
  })

  return faster(urls, (err, fastest) => {
    if (err)
      return callback(err)

    return callback(null, fastest)
  })
}

// @param {String, JSON} text
// @param {Function} callback
function canDownload (text, callback){
  const md5 = text.md5 ? text.md5.toLowerCase() : text.toLowerCase()

  const urls = mirrors.filter(value => {
    return value.canDownloadDirect
  }).map(value => {
    return { method: 'HEAD', url: `${value.baseUrl}/get.php?md5=${md5}` }
  })

  return faster(urls, (err, fastest) => {
    if (err)
      return callback(err)

    return callback(null, fastest)
  })
}
