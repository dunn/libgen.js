var latest = require('./latest.js');
var clean = require('./clean.js');
var request = require('request');
var async = require('async');

function rInt(min,max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  text: function(options,callback){
    if (!options.mirror){
      return callback(
        new Error('No mirror given to random.text()'));
    }
    latest.id(options.mirror, function(err,data){
      if (err) return callback(err);
      if (!options.count || !parseInt(options.count)){
        options.count = 10;
      }

      var texts = [];
      async.until(
        function(){
          return texts.length >= options.count;
        },
        function (callback){
          var picks = [];
          var n = options.count;

          // if there are required fields, pull the maximum number of
          // texts each time to reduce the number of http requests
          if (options.fields) {
            var len = data.length;
            // The max url length libgen will accept is 8192;
            // Subtract the length of rest of gen.lib.rus.ec string (44 chars) = 8148
            // Subtract the maximum possible length of the next ID we add (len)
            while (picks.join(',').length < (8148 - len)) {
              picks.push(rInt(1,data));
            }
          }
          else {
            while (n--){
              picks.push(rInt(1,data));
            }
          }
          picks = picks.join(',');

          var httpOpts = {
            url: options.mirror +
              '/json.php' +
              '?ids=' + picks +
              '&fields=*'
          };
          request(httpOpts, function(err,response,body){
            if (err) return callback(err);
            if (response.statusCode !== 200){
              return callback(
                new Error('Bad response: ' +
                          response.statusCode));
            }
            var raw = JSON.parse(body);
            var filters = options.fields;
            var cleaned;
            if (filters && Array.isArray(filters)){
              var n = filters.length;
              cleaned = raw;
              while (n--){
                // with a lot of filters we might have removed everything
                if (cleaned) {
                  cleaned = clean.forFields(cleaned,filters[n]);
                }
              }
              if (cleaned){
                texts = texts.concat(cleaned);
              }
            }
            else if (filters){
              cleaned = clean.forFields(raw,filters);
              if (cleaned){
                texts = texts.concat(cleaned);
              }
            }
            else {
              texts = texts.concat(raw);
            }
            // prevent TypeErrors if nothing has been added to the
            // array
            if (texts.length) {
              texts = clean.dups(texts);
            }
            return callback();
          });
        },
        function(err) {
          if (err) return callback(err);
          texts.splice(0,(texts.length)-options.count);
          return callback(null,texts);
        }
      );
    });
  }
};
