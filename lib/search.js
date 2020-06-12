"use strict"

const got = require("got")

const ID_REGEX = /ID\:[^0-9]+[0-9]+[^0-9]/g
const RESULT_REGEX = /[0-9]+\ files\ found/i

function extractIds(html) {
  let ids = []
  const idsResults = html.match(ID_REGEX)
  // reverse the order of the results because we walk through them
  // backwards with while(n--)
  idsResults.reverse()
  let n = idsResults.length
  while (n--) {
    const id = idsResults[n].replace(/[^0-9]/g,"")

    if (!parseInt(id))
      return false

    ids.push(id)
  }
  return ids
}

async function idFetch(options) {
  if (!options.mirror)
    return new Error("No mirror provided to search function")

  else if (!options.query)
    return new Error("No search query given")

  else if (options.query.length < 4)
    return new Error("Search query must be at least four characters")

  if (!options.count || !parseInt(options.count))
    options.count = 10

  // sort_by options: "def", "title", "publisher", "year", "pages",
  // "language", "filesize", "extension" (must be lowercase)
  const sort = options.sort_by || "def"

  // search_in options: "def", "title", "author", "series",
  // "periodical", "publisher", "year", "identifier", "md5",
  // "extension"
  const column = options.search_in || "def"

  // boolean
  const sortmode = (options.reverse ? "DESC" : "ASC")

  const query = options.mirror +
        "/search.php?&req=" +
        encodeURIComponent(options.query) +
        // important that view=detailed so we can get the real IDs
        "&view=detailed" +
        "&column=" + column +
        "&sort=" + sort +
        "&sortmode=" + sortmode +
        "&page=1"

  try {
    const response = await got(query)

    let results = response.body.match(RESULT_REGEX)
    if (results === null)
      return new Error("Bad response: could not parse search results")
    else
      results = results[0]

    results = parseInt(results.replace(/^([0-9]*).*/,"$1"))

    if (results === 0)
      return new Error(`No results for "${options.query}"`)

    else if (!results)
      return new Error("Could not determine # of search results")

    let searchIds = extractIds(response.body)
    if (!searchIds)
      return new Error("Failed to parse search results for IDs")

    do {
      const query = options.mirror +
            "/search.php?&req=" +
            encodeURIComponent(options.query) +
            // important that view=detailed so we can get the real IDs
            "&view=detailed" +
            "&column=" + column +
            "&sort=" + sort +
            "&sortmode=" + sortmode +
            "&page=" +
            // parentheses around the whole ensures the plus sign is
            // interpreted as addition and not string concatenation
            (Math.floor((searchIds.length) / 25) + 1)

      try {
        let page = await got(query)

        const newIds = extractIds(page.body)
        if (!newIds)
          return new Error("Failed to parse search results for IDs")
        else
          searchIds = searchIds.concat(newIds)
      } catch (err) {
        return err
      }
      // repeat search if the number of records requested is more than we get on
      // the first query
    } while (searchIds.length < options.count)

    return searchIds
  } catch (err) {
    return err
  }
}

module.exports = async function(options) {
  try {
    let ids = await idFetch(options)

    if (ids.length > options.count)
      ids = ids.slice(0, options.count)

    const url = `${options.mirror}/json.php?ids=${ids.join(",")}&fields=*`

    try {
      const response = await got(url)
      return JSON.parse(response.body)
    } catch (err) {
      return err
    }
  } catch (err) {
    return err
  }
}
