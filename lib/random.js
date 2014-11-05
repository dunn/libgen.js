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

          // if there are required fields, bump the number of texts we
          // pull each time to reduce the number of http requests
          if (options.fields) {
            n = (n * options.fields.length);
          }

          while (n--){
            picks.push(rInt(1,data));
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
                cleaned = clean.forFields(cleaned,filters[n]);
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
            texts = clean.dups(texts);
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
