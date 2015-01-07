var async = require('async');
var request = require('request');

// libgen.org may be permanently down:
// https://github.com/grumble/libgen.js/issues/2
var baseUrls = [
  'http://gen.lib.rus.ec'
  // 'http://libgen.org'
];

function timeConnection(item,callback){
  var start = Date.now();
  var httpOptions = {
    url: item +
      '/json.php?ids=1&fields=*'
  };
  request(httpOptions, function(err,response,body){
    if (err) return callback(err);
    if (response.statusCode !== 200){
      return callback(null,false);
    }
    else {
      var results = {
        url: item,
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
    var bestMirror = '';
    var end = results.length;
    var i = 0;
    for (i; i < end; i++){
      var fastest = results.every(function(value,index,array){
        return results[i].time >= results[index].time;
      });
      if (fastest) bestMirror = results[i].url;
      break;
    }
    return callback(null,bestMirror);
  });
};
