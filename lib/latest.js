"use strict"

const got = require("got")

// TODO: this is pretty brittle; if libgen changes how they format results it
// will break
const LATEST_ID_REGEX = /<td>[0-9]+<\/td>/g

module.exports = {
  id: async function(mirror) {
    const url = `${mirror}/search.php?mode=last`

    try {
      const response = await got(url)
      const idsResults = response.body.match(LATEST_ID_REGEX)
      const latestId = idsResults[0].replace(/[^0-9]/g,"")
      if (!parseInt(latestId))
        return new Error(`Failed to return a numeric ID: ${latestId}`)

      // returning the original string rather than an int because once the IDs
      // get higher JS starts mangling them
      return latestId

    } catch (err) {
      console.dir(err)
      return err
    }
  },
  text: async function(mirror) {
    try {
      const ids = await this.id(mirror)
      const url = `${mirror}/json.php?ids=${ids}&fields=*`
      const response = await got(url)

      // the API always returns an array of objects, so for functions like this
      // which are mean to return a single text, we pick out the first (only)
      // element in the array automatically
      return JSON.parse(response.body)[0]

    } catch (err) {
      console.dir(err)
      return err
    }
  }
};
