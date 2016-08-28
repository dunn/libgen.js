'use strict';

const async = require('async');
const request = require('request');
const baseUrls = require('../available_mirrors.js');

function timeConnection(item,callback){
  const start = Date.now();
  var httpOptions = { url: `${item.baseUrl}/json.php?ids=1&fields=*` };

  request(httpOptions, (err, response, body) => {
    // async.map will fail if any of the timeConnections returns an
    // error, but we only care that at least one succeeds; so fail
    // silently
    if (err)
      return callback(null);

    else if (response.statusCode !== 200)
      return callback(null, false);

    else {
      const results = {
        url: item.baseUrl,
        time: Date.now() - start
      };
      return callback(null, results);
    }
  });
}

module.exports = function(callback){
  var n = 0;
  async.map(baseUrls, timeConnection, (err, results) => {
    if (err)
      return console.error(err);

    const noResponses = results.every((value, index, array) => {
      return !value;
    });

    if (noResponses)
      return callback(new Error('Bad response from all mirrors'));

    const sorted = results.sort((a, b) => {
      return a.time - b.time;
    });

    return callback(null, sorted[0].url);
  });
};
