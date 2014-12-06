var assert = require('assert');

var latest = require('../../lib/latest.js');
var getMirror = require('../../lib/mirror.js');
var random = require('../../lib/random.js');
var check = require('../../lib/check.js');
var search = require('../../lib/search.js');

// get a working mirror and use that for the rest of the tests
var mirror;
describe('mirrors.js', function(){
  it('should return a working mirror base URL', function(done){
    getMirror(function(err,string){
      if (err) return done(err);
      if (!string){
        return done(new Error('somehow returned an empty string'));
      }
      mirror = string;
      console.log('using ' + mirror);
      return done();
    });
  });
});

describe('latest.id', function(){
  it('should return a number over 1282650', function(done){
    latest.id(mirror,function(err, data){
      if (err) return done(err);
      if (!parseInt(data)) {
        return done(new Error('Returned a NaN'));
      }
      if (parseInt(data) < 1282650) {
        return done(new Error('Number returned (' +
                              data + ') is too low'));
      }
      return done(null,data);
    });
  });
});

describe('latest.text',function(){
  it('should return a JSON object',function(done){
    latest.text(mirror,function(err,data){
      if (err) return done(err);
      return done(null,data);
    });
  });
});

describe('random.text',function(){
  it('should return at least one JSON object',function(done){
    var opts = {
      count: 'honk',
      mirror: mirror
    };
    random.text(opts,function(err,data){
      if (err) return done(err);
      return done(null,data);
    });
  });
  it('should return exactly 30 English PDFs from 2000 with Titles', function(done){
    var opts = {
      mirror: mirror,
      count: 30,
      fields: [
        'Title',
        { Language: 'English' },
        { Year: '2000',
          Extension: 'pdf' }
      ]
    };
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

describe('search.js',function(){
  it('should return an array of 30 JSON objects',function(done){
    var options = {
      mirror: mirror,
      query: 'math',
      count: 30,
      search_in: 'series'
    };
    search(options,function(err,data){
      if (err) return done(err);
      assert.equal(data.length,30);
      return done();
    });
  });
  it('should return an array of 10 JSON objects',function(done){
    var options = {
      mirror: mirror,
      query: 'math',
      count: 0
    };
    search(options,function(err,data){
      if (err) return done(err);
      assert.equal(data.length,10);
      return done();
    });
  });
});
