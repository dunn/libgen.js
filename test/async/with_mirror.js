var assert = require('assert');

// get a working mirror and use that for the rest of the tests
var mirror;
describe('mirrors.js', function(){
  it('should return a working mirror base URL', function(done){
    var getMirror = require('../../lib/mirror.js');
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

var latest = require('../../lib/latest.js');
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

var random = require('../../lib/random.js');
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
});

var search = require('../../lib/search.js');
describe('search.js',function(){
  it('should return an array of 30 JSON objects',function(done){
    var options = {
      mirror: mirror,
      query: 'math',
      count: 30
    };
    search(options,function(err,data){
      if (err) return done(err);
      assert.equal(data.length,30);
      done();
    });
  });
});
