var async = require('async');
var request = require('request');

module.exports = function(callback){
  var baseUrls = [
    'http://gen.lib.rus.ec',
    'http://libgen.org'
  ];
  var workingMirror;
  var n = 0;
  async.parallel([
    function(callback){
      var start = Date.now();
      var httpOptions = {
        url: baseUrls[0] + '/json.php?ids=1&fields=*'
      };
      request(httpOptions, function(err, response, body){
        if (err) return callback(err);
        if (response.statusCode !== 200){
          return callback(null,false);
        }
        else {
          var results = {
            url: baseUrls[0],
            time: Date.now() - start
          };
          return callback(null,results);
        }
      });
    },
    function(callback){
      var start = Date.now();
      var httpOptions = {
        url: baseUrls[1] + '/json.php?ids=1&fields=*'
      };
      request(httpOptions, function(err, response, body){
        if (err) return callback(err);
        if (response.statusCode !== 200){
          return callback(null,false);
        }
        else {
          var results = {
            url: baseUrls[1],
            time: Date.now() - start
          };
          return callback(null,results);
        }
      });
    }],function(err,results){
      if (err) return console.error(err);
      if (!results[0] && !results[1]){
        return callback(new Error('Bad response from both mirrors'));
      }
      else if (!results[0]){
        return callback(null,results[1].url);
      }
      else if (!results[1]){
        return callback(null,results[0].url);
      }
      else if (results[0].time < results[1].time){
        // console.log('gen.lib: ' + results[0].time);
        // console.log('libgen: ' + results[1].time);
        return callback(null,results[0].url);
      }
      else {
        // console.log('gen.lib: ' + results[0].time);
        // console.log('libgen: ' + results[1].time);
        return callback(null,results[1].url);
      }
    });
};
