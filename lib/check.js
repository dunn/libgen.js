'use strict';

const request = require('request');
const async = require('async');

// accepts LibGen API JSON objects
module.exports = {
  hasField: function(json, field, value){
    if (/^\s*$/.test(json[field.toLowerCase()]))
      return false;
    else if (value)
      return json[field.toLowerCase()] === value;
    else
      return true;
  },
  // text can be a json object or an MD5 string
  canDownload: function(text, callback){
    const md5 = (text.md5) ? text.md5.toLowerCase() : text.toLowerCase();

    const mirrors = require('../available_mirrors.js');
    let downloadMirrors = [];
    let n = mirrors.length;
    // create an array of mirrors that allow direct downloads
    while (n--)
      if (mirrors[n].canDownloadDirect)
        downloadMirrors = downloadMirrors.concat(mirrors[n].baseUrl);

    n = downloadMirrors.length;
    let liveLink = false;
    async.whilst(
      function() { return n-- && !liveLink; },
      function(callback) {
        const options = {};
        options.method = 'HEAD';
        options.url = `${downloadMirrors[n]}/get.php?md5=`;
        options.url += md5;

        request(options, (err, response, body) => {
          // don't stop because one mirror has problems
          // if (err) return callback(err);
          if (response.statusCode === 200)
            liveLink = options.url;
          return callback();
        });
      },
      function(err) {
        if (err)
          return callback(err);
        else if (liveLink)
          return callback(null, liveLink);
        else
          return callback(new Error(`No working direct download links for ${md5}`));
      });
  }
};
