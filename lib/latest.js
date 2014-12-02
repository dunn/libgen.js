var request = require('request');

module.exports = {
  id: function(mirror,callback){
    var httpOptions = {
      url: mirror + '/search.php?mode=last'
    };
    request(httpOptions, function(err,response,body){
      if (err) {
        console.error('Request error');
        return callback(err);
      }
      else if (response.statusCode !== 200){
        return callback(
          new Error('Bad reponse code (' +
                    response.statusCode +
                    ') for ' + httpOptions.url));
      }
      // this is pretty brittle; if libgen changes how they format
      // results it will break
      var latestIdRegex = /<td>[0-9]+<\/td>/g;
      var idsResults = body.match(latestIdRegex);
      var latestId = idsResults[0].replace(/[^0-9]/g,"");
      if (!parseInt(latestId)) {
        return callback(
          new Error('Failed to return a numeric ID: ' +
                    latestId));
      }
      // returning a string rather than a number because once the IDs
      // get higher JS might start mangling them
      return callback(null,latestId);
    });
  },
  text: function(mirror,callback){
    this.id(mirror,function(err,data){
      if (err) return callback(err);
      var httpOpts = {
        url: mirror +
          '/json.php?ids=' +
          data +
          '&fields=*'
      };
      request(httpOpts,function(err,response,body){
        if (err) return callback(err);
        if (response.statusCode !== 200){
          return callback(
            new Error('Bad response code: ' +
                      response.statusCode));
        }
        // the API always returns an array of objects, so for
        // functions like this which are mean to return a single text,
        // we pick out the first (only) element in the array
        // automatically
        return callback(null,JSON.parse(body)[0]);
      });
    });
  }
};
