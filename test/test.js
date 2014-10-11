var assert = require('assert');

describe('latest.id()', function(){
  it('should return number', function(done){
    var latest = require('../lib/latest.js');
    latest.id('http://gen.lib.rus.ec',function(err, data){
      if (err) return done(err);
      return done();
    });
  });
});
