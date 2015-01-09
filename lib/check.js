var request = require('request');
var async = require('async');

// accepts LibGen API JSON objects
module.exports = {
  hasField: function(json,field,value){
    if (/^\s*$/.test(json[field])){
      return false;
    }
    else if (value){
      return json[field] === value;
    }
    else {
      return true;
    }
  },
  // text can be a json object or an MD5
  canDownload: function(text,callback){
    var md5 = (text.MD5) ? text.MD5.toLowerCase() : text.toLowerCase();

    var downloadMirrors = [];
    var mirrors = require('../available_mirrors.js');
    var n = mirrors.length;
    // create an array of mirrors that allow direct downloads
    while (n--){
      if (mirrors[n].canDownloadDirect){
        downloadMirrors = downloadMirrors.concat(mirrors[n].baseUrl);
      }
    }

    n = downloadMirrors.length;
    var liveLink = false;
    async.whilst(
      function(){ return n-- && !liveLink; },
      function(callback) {
        var options = {};
        options.method = 'HEAD';
        options.url = downloadMirrors[n] + '/get.php?md5=';
        options.url += md5;

        request(options, function(err,response,body){
          // don't stop because one mirror has problems
          // if (err) return callback(err);
          if ( response.statusCode === 200 ){
            liveLink = options.url;
          }
          return callback();
        });
      },
      function(err) {
        if (err) return callback(err);
        if (liveLink) return callback(null,liveLink);
        else {
          return callback(
            new Error('No working direct download links for ' +
                      md5));
        }
      });
  }
};
