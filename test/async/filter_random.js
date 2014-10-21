var assert = require('assert');
var random = require('../../lib/random.js');
var check = require('../../lib/check.js');

var opts = {
  mirror: 'http://libgen.org',
  count: 5,
  fields: ['Year',
           'Title',
           { Language: 'English' }
          ]
};

describe('random.text',function(){
  it('should return exactly 5 texts with Year+Title+English',function(done){
    random.text(opts,function(err,data){
      if (err) return done(err);
      var n = data.length;
      // console.log('received ' + n + ' texts');
      assert.equal(n,opts.count,
                   'received wrong # of texts (' + n + ')');
      while (n--){
        assert.ok(check.hasField(data[n],'Year'),
                  'text ' + n + ' is missing Year');
        assert.ok(check.hasField(data[n],'Title'),
                 'text ' + n + ' is missing Title');
        assert.ok(check.hasField(data[n],'Language','English'),
                 'text ' + n + ' is in ' + data[n].Language);
      }
      return done();
    });
  });
});
