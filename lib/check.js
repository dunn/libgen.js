var request = require('request');

// accepts LibGen API JSON objects
module.exports = {
  hasField: function(json,field){
    return !/^\s*$/.test(json[field]);
  },
  // text can be a json object or an MD5
  canDownload: function(text,callback){
    var baseUrl = 'http://libgen.org/get?md5=';

    var options = {};
    options.method = 'HEAD';
    options.url = 'http://libgen.org/get?md5=';

    if (typeof text === 'string'){
      options.url += text.toLowerCase();
    }
    else if (text.MD5){
      options.url += text.MD5.toLowerCase();
    }
    else {
      return callback(new Error('Bad argument for canDownload: either JSON text or MD5 string'));
    }
    request(options, function (err, response, body){
      if (err) return callback(err);
      if ( response.statusCode !== 200 ){
        var httpError = {
          code: response.statusCode,
          url: options.url
        };
        return callback(new Error(httpError.code + ': ' + httpError.url));
      }
      return callback(null,options.url);
    });
  }
};
