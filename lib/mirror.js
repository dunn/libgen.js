var async = require('async');
var request = require('request');

var baseUrls = require('../available_mirrors.js');

function timeConnection(item,callback){
  var start = Date.now();
  var httpOptions = {
    url: item.baseUrl +
      '/json.php?ids=1&fields=*'
  };
  request(httpOptions, function(err,response,body){
    // async.map will fail if any of the timeConnections returns an
    // error; so fail silently
    if (err) return callback(null);

    if (response.statusCode !== 200){
      return callback(null,false);
    }
    else {
      var results = {
        url: item.baseUrl,
        time: Date.now() - start
      };
      return callback(null,results);
    }
  });
}

module.exports = function(callback){
  var n = 0;
  async.map(baseUrls, timeConnection, function(err,results){
    if (err) return console.error(err);

    var noResponses = results.every(function(value,index,array){
      return !value;
    });
    if (noResponses){
      return callback(
        new Error('Bad response from all mirrors'));
    }

    var sorted = results.sort(function(a,b){
      return a.time - b.time;
    });

    return callback(null,sorted[0].url);
  });
};
