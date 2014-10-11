var async = require('async');
var request = require('request');

module.exports = function(callback){
  var baseUrls = [
    'http://libgen.org',
    'http://gen.lib.rus.ec'
  ];
  var workingMirror;
  var n = 0;
  async.until(
    function(){return workingMirror;},
    function(callback){
      var httpOptions = {
        url: baseUrls[n],
        method: 'HEAD'
      };
      request(httpOptions, function(err, response, body){
        if (err) return callback(err);
        if (n >= baseUrls.length){
          return callback(new Error('Bad response code from all mirrors'));
        }
        if (response.statusCode !== 200){
          n++;
          return callback(null);
        }
        else {
          workingMirror = httpOptions.url;
          return callback(null);
        }
      });
    },
    function(err){
      if (err) return console.error(err);
      return callback(null,workingMirror);
    });
};
