var assert = require('assert');

var check = require('../../lib/check.js');
var single = require('../json/single.json');

describe('check.js',function(){
  describe('hasField()',function(){
    it('should find 25 filled fields',function(){
      var c = 0;
      for (var key in single){
        if (check.hasField(single,key)){
          c++;
        }
      }
      assert.equal(c,25);
    });
    it('should return true',function(){
      var yearField = check.hasField(single,'year','1998');
      assert.ok(yearField);
    });
    it('should return false',function(){
      var yearField = check.hasField(single,'year','1990');
      assert.ok(!yearField);
    });
  });
});
