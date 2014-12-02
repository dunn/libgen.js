var assert = require('assert');
var random = require('../../lib/random.js');
var check = require('../../lib/check.js');

var opts = {
  mirror: 'http://libgen.org',
  count: 30,
  fields: [
    'Title',
    { Language: 'English' },
    { Year: '2000',
      Extension: 'pdf' }
  ]
};

describe('random.text',function(){
  it('should return exactly 30 English PDFs from 2000 with Titles',function(done){
    random.text(opts,function(err,data){
      if (err) return done(err);
      var n = data.length;
      // console.log('received ' + n + ' texts');
      assert.equal(n,opts.count,
                   'received wrong # of texts (' + n + ')');
      while (n--){
        assert.ok(check.hasField(data[n],'Title'),
                 'text ' + n + ' is missing Title');
        assert.ok(check.hasField(data[n],'Year', '2000'),
                  'text ' + n + ' has Year ' + data[n].Year);
        assert.ok(check.hasField(data[n],'Language','English'),
                 'text ' + n + ' is in ' + data[n].Language);
        assert.ok(check.hasField(data[n],'Extension','pdf'),
                 'text ' + n + ' is a ' + data[n].Extension);
      }
      return done();
    });
  });
});
