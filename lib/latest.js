var cheerio = require('cheerio');
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
        return callback(new Error('Bad reponse code (' +
                                  response.statusCode + ') for ' +
                                  httpOptions.url));
      }
      var $ = cheerio.load(body);
      // more testing needed to confirm that the big table is the only
      // one with class 'c'
      var latestId = $('table[class=c]').children('tr').eq(1).children('td').eq(0).text();
      if (!parseInt(latestId)) {
        return callback(new Error('Failed to return a numeric ID: ' +
                                  latestId));
      }
      return callback(null,latestId);
    });
  },
  text: function(mirror,callback){
    this.id(mirror,function(err,data){
      if (err) return callback(err);
      var httpOpts = {
        url: mirror + '/json.php?ids=' + data +
          '&fields=*'
      };
      request(httpOpts,function(err,response,body){
        if (err) return callback(err);
        if (response.statusCode !== 200){
          return callback(new Error('Bad response code: ' +
                                    response.statusCode));
        }
        return callback(null,JSON.parse(body));
      });
    });
  }
};
