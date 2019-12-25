"use strict"

const clean = require("./clean.js")
const got = require("got")
const latest = require("./latest.js")

function rInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = {
  text: async function(options) {
    if (!options.mirror)
      return new Error("No mirror given to random.text()")

    try {
      const data = await latest.id(options.mirror)

      if (!options.count || !parseInt(options.count))
        options.count = 1

      let texts = []

      while (texts.length < options.count) {
        let picks = []
        let n = options.count

        // if there are required fields, pull the maximum number of texts each
        // time to reduce the number of http requests
        if (options.fields) {
          // The max url length libgen will accept is 8192; subtract the length
          // of rest of the URL string plus the maximum possible length of the
          // next ID we add (len)
          const len = data.length;
          const urlStringLength = `${options.mirror}/json.php?ids=&fields=*`.length
          while (picks.join(",").length < (urlStringLength - len))
            picks.push(rInt(1, data))
        } else {
          while (n--)
            picks.push(rInt(1, data))
        }

        picks = picks.join(",")

        const url = `${options.mirror}/json.php?ids=${picks}&fields=*`

        try {
          const response = await got(url)
          const raw = JSON.parse(response.body)

          const filters = options.fields
          let cleaned

          if (filters && Array.isArray(filters)) {
            cleaned = raw
            let f = filters.length
            while (f--) {
              // with a lot of filters we might have removed everything, so we
              // add this guard clause
              if (cleaned)
                cleaned = clean.forFields(cleaned, filters[f])
            }
            if (cleaned)
              texts = texts.concat(cleaned)

          } else if (filters) {
            cleaned = clean.forFields(raw, filters)
            if (cleaned)
              texts = texts.concat(cleaned)

          } else
            texts = texts.concat(raw)

          // prevent TypeErrors if nothing has been added to the array
          if (texts.length)
            texts = clean.dups(texts)

        } catch (err) {
           return err
        }
      }

      texts.splice(0, (texts.length) - options.count)
      return texts

    } catch (err) {
      return err
    }
  }
}
