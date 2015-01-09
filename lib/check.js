var request = require('request');

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
    var options = {};
    options.method = 'HEAD';
    options.url = 'http://libgen.in/get.php?md5=';

    if (text.MD5){
      options.url += text.MD5.toLowerCase();
    }
    else {
      options.url += text.toLowerCase();
    }

    request(options, function(err,response,body){
      if (err) return callback(err);
      else if ( response.statusCode !== 200 ){
        var httpError = {
          code: response.statusCode,
          url: options.url
        };
        return callback(
          new Error(httpError.code + ': ' +
                    httpError.url));
      }
      return callback(null,options.url);
    });
  }
};
