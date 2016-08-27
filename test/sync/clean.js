var assert = require('assert');
var clean = require('../../lib/clean.js');
var single = require('../json/single.json');
var multiple = require('../json/multiple.json');
describe('clean',function(){
  describe('forFields',function(){
    describe('single text',function(){
      describe('strip if no Publisher (string and array)',function(){
        it('should remove the object and return nothing',function(){
          var empty = !clean.forFields(single,'publisher');
          assert.ok(empty);
        });
        it('should remove the object and return nothing',function(){
          var empty = !clean.forFields(single,['publisher']);
          assert.ok(empty);
        });
      });
      describe('strip if no Title (string and array)',function(){
        it('should return the object',function(){
          var json = clean.forFields(single,'title');
          assert.equal(typeof json,'object');
        });
        it('should return the object',function(){
          var json = clean.forFields(single,['title']);
          assert.equal(typeof json,'object');
        });
      });
    });
    describe('multiple texts',function(){
      describe('strip if not Cleaned (string and array)',function(){
        it('should return nothing',function(){
          var empty = !clean.forFields(multiple,'cleaned');
          assert.ok(empty);
        });
        it('should return nothing',function(){
          var empty = !clean.forFields(multiple,['cleaned']);
          assert.ok(empty);
        });
      });
      describe('strip if not Searchable (string and array)',function(){
        it('should return an array of two texts',function(){
          var json = clean.forFields(multiple,'searchable');
          assert.equal(json.length,2);
        });
        it('should return an array of two texts',function(){
          var json = clean.forFields(multiple,['searchable']);
          assert.equal(json.length,2);
        });
      });
      describe('remove texts that are not Russian from 2002',function(){
        it('should return an array of two texts',function(){
          var json = clean.forFields(multiple, { language: 'Russian', year: '2002'});
          assert.equal(json.length,1);
        });
      });
    });
  });
  describe('dups',function(){
    it('should remove the duplicate object and return an array of length 3',function(){
      var duplicates = require('../json/duplicate.json');
      var cleaned = clean.dups(duplicates);
      assert.equal(cleaned.length,3);
    });
  });
});
