'use strict';

const latest = require('./latest.js');
const clean = require('./clean.js');
const request = require('request');
const async = require('async');

function rInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  text: function(options, callback){
    if (!options.mirror)
      return callback(new Error('No mirror given to random.text()'));

    latest.id(options.mirror, (err, data) => {
      if (err)
        return callback(err);

      else if (!options.count || !parseInt(options.count))
        options.count = 1;

      let texts = [];
      async.until(
        function() { return texts.length >= options.count; },

        function(callback){
          let picks = [];
          let n = options.count;

          // if there are required fields, pull the maximum number of
          // texts each time to reduce the number of http requests
          if (options.fields) {
            const len = data.length;
            // The max url length libgen will accept is 8192;
            // Subtract the length of rest of gen.lib.rus.ec string (44 chars) = 8148
            // Subtract the maximum possible length of the next ID we add (len)
            while (picks.join(',').length < (8148 - len))
              picks.push(rInt(1,data));
          }
          else
            while (n--)
              picks.push(rInt(1, data));

          picks = picks.join(',');

          const httpOptions = { url: `${options.mirror}/json.php?ids=${picks}&fields=*` };

          request(httpOptions, (err, response, body) => {
            if (err)
              return callback(err);
            else if (response.statusCode !== 200)
              return callback(new Error(`Bad response: ${response.statusCode}`));

            const raw = JSON.parse(body);
            const filters = options.fields;
            let cleaned;

            if (filters && Array.isArray(filters)) {
              var n = filters.length;
              cleaned = raw;
              while (n--)
                // with a lot of filters we might have removed everything
                if (cleaned)
                  cleaned = clean.forFields(cleaned, filters[n]);

              if (cleaned)
                texts = texts.concat(cleaned);
            }
            else if (filters) {
              cleaned = clean.forFields(raw, filters);
              if (cleaned)
                texts = texts.concat(cleaned);
            }
            else
              texts = texts.concat(raw);

            // prevent TypeErrors if nothing has been added to the
            // array
            if (texts.length)
              texts = clean.dups(texts);

            return callback();
          });
        },
        function(err) {
          if (err)
            return callback(err);
          texts.splice(0, (texts.length) - options.count);
          return callback(null, texts);
        }
      );
    });
  }
};
