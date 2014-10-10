//var cheerio = require('cheerio');
var request = require('request');

module.exports = {
  id: function(mirror, callback){
    var httpOptions = {
      url: mirror + '/search.php?mode=last'
    };
    request(httpOptions, function (err, response, body){
      if (err) {
        console.error('Request error');
        return callback(err);
      }
      else if (response.statusCode !== 200){
        return callback(new Error('Bad reponse code: ' +
                                  response.statusCode));
      }
      callback(body);
    });
  }
};
