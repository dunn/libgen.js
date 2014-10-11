var assert = require('assert');

// get a working mirror and use that for the rest of the tests
var mirror;
describe('mirrors.js', function(){
  it('should return a working mirror base URL', function(done){
    var getMirror = require('../lib/mirrors.js');
    getMirror(function(err,string){
      if (err) return done(err);
      if (!string){
        return done(new Error('somehow returned an empty string'));
      }
      mirror = string;
      return done();
    });
  });
});


describe('latest.id()', function(){
  it('should return a number over 1282650', function(done){
    var latest = require('../lib/latest.js');
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
