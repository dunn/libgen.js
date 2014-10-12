var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

function _idFetch(options,callback){
  if (!options.mirror){
    return callback(new Error('No mirror given to search func'));
  }
  if (!options.query){
    return callback(new Error('No search query given'));
  }
  if (!options.count ||
      !parseInt(options.count)){
    options.count = 1;
  }
  var query = options.mirror +
        '/search.php?&req=' + options.query +
        // important that view=detailed so we can get the real IDs
        '&view=detailed&column=def&sort=def&sortmode=ASC&page=1';
  var httpOpts = {
    url: query
  };
  request(httpOpts,function(err,response,body){
    if (err) return callback(err);
    if (response.statusCode !== 200){
      return callback(new Error('Bad response: ' +
                                response.statusCode));
    }
    var $ = cheerio.load(body);

    var searchIds = [];

    // don't worry, this makes no sense to me either; 'table[class=c]'
    // HAS NO CHILDREN, the tables we care about are SIBLINGS, but
    // either cheerio or libgen or Web Inspector is way fucked
    var list = $('table[class=c]').children().children();
    list.each(function(i,elem){
      var kids = $(this).children();
      if (kids.length > 0){
        var id = kids.children('tr').eq(7).children('td').eq(3).html();
        if (!parseInt(id)){
          return callback(new Error('Cheerio found NaN instead of valid ID'));
        }
        searchIds.push(id);
      }
    });

    if (options.count > 25){
      // ought to be able to use .next('table') instead of
      // .next().next(), but cheerio is being bad
      var results = $('#paginator_example_top').next().next();
      if (results.is('table')){
        results = results.children('tr').eq(0).children('td').eq(0).text();
      }
      else {
        return callback(new Error('Cheerio failed to find results # table'));
      }
      results = results.replace(/^([0-9]*).*/,"$1");
      if (!parseInt(results)){
        return callback(new Error('Cheerio found NaN instead of # of results'));
      }
      // pages = Math.floor(results / 25);
      async.until(
        function(){return searchIds.length >= options.count;},
        function(callback){
          var query = options.mirror +
                '/search.php?&req=' + options.query +
                // important that view=detailed so we can get the real IDs
                '&view=detailed&column=def&sort=def&sortmode=ASC&page=' +
                // parentheses around the whole ensure it's addition
                // and not string concatenation
                (Math.floor((searchIds.length) / 25) + 1);
          var httpOpts = {
            url: query
          };
          request(httpOpts,function(err,response,body){
            if (err) return callback(err);
            if (response.statusCode !== 200){
              return callback(new Error('Bad response: ' +
                                        response.statusCode));
            }
            var $ = cheerio.load(body);

            var list = $('table[class=c]').children().children();
            list.each(function(i,elem){
              var kids = $(this).children();
              if (kids.length > 0){
                var id = kids.children('tr').eq(7).children('td').eq(3).html();
                if (!parseInt(id)){
                  return callback(new Error('Cheerio found NaN instead of valid ID'));
                }
                searchIds.push(id);
              }
            });
            callback(null);
          });
        },
        function(err){
          if (err) return callback(err);
          if (searchIds.length > options.count){
            searchIds = searchIds.slice(0,options.count);
          }
          return callback(null,searchIds);
        });
    }
    else {
      return callback(null,searchIds);
    }
  });
}

module.exports = {
  byString: function(options,callback){
    async.waterfall([
      function(callback){
        _idFetch(options,function(err,data){
          if (err) return callback(err);
          return callback(null,data);
        });
      }],function(err,results){
        if (err) return callback(err);
        var idString = results.join(',');
        var httpOpts = {
          url: options.mirror + '/json.php?ids=' + idString +
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
