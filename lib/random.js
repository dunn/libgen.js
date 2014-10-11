var latest = require('./latest.js');
var request = require('request');

module.exports = {
  text: function(options,callback){
    if (!options.mirror){
      return callback(new Error('No mirror given to random.text()'));
    }
    latest.id(options.mirror,function(err,data){
      if (err) return callback(err);
      if (!options.count ||
          !parseInt(options.count)){
        options.count = 1;
      }

      function rInt(min,max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      var picks = [];
      var n = options.count;
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
      request(httpOpts,function(err,response,body){
        if (err) return callback(err);
        if (response.statusCode !== 200){
          return callback(new Error('Bad response: ' +
                                    response.statusCode));
        }
        return callback(null,JSON.parse(body));
      });
    });
  }
};
