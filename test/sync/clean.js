var assert = require('assert');
var clean = require('../../lib/clean.js');
var single = require('../json/single.json');
var multiple = require('../json/multiple.json');
describe('clean()',function(){
  describe('single text',function(){
    describe('strip if no Publisher (string and array)',function(){
      it('should remove the object and return nothing',function(){
        var empty = !clean(single,'Publisher');
        assert.ok(empty);
      });
      it('should remove the object and return nothing',function(){
        var empty = !clean(single,['Publisher']);
        assert.ok(empty);
      });
    });
    describe('strip if no Title (string and array)',function(){
      it('should return the object',function(){
        var json = clean(single,'Title');
        assert.equal(typeof json,'object');
      });
      it('should return the object',function(){
        var json = clean(single,['Title']);
        assert.equal(typeof json,'object');
      });
    });
  });
  describe('multiple texts',function(){
    describe('strip if not Cleaned (string and array)',function(){
      it('should return nothing',function(){
        var empty = !clean(multiple,'Cleaned');
        assert.ok(empty);
      });
      it('should return nothing',function(){
        var empty = !clean(multiple,['Cleaned']);
        assert.ok(empty);
      });
    });
    describe('strip if not Searchable (string and array)',function(){
      it('should return an array of two texts',function(){
        var json = clean(multiple,'Searchable');
        assert.equal(json.length,2);
      });
      it('should return an array of two texts',function(){
        var json = clean(multiple,['Searchable']);
        assert.equal(json.length,2);
      });
    });
  });
});
