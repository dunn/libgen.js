var assert = require('assert');

describe('latest.id()', function(){
  it('should return a number over 1282650', function(done){
    var latest = require('../lib/latest.js');
    latest.id('http://gen.lib.rus.ec',function(err, data){
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
