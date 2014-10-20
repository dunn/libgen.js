var assert = require('assert');
var check = require('../../lib/check.js');
describe('check.js',function(){
  describe('canDownload()',function(){
    it('should return a 404',function(done){
      var badMd5 = '8e69614e79fd09ccdc60honkhonk';
      check.canDownload(badMd5,function(err,response){
        if (err) {
          return done();
        }
        return done(new Error('Wrong response code'));
      });
    });
    it('should return a 404',function(done){
      var badJson = require('../json/404.json');
      check.canDownload(badJson,function(err,response){
        if (err) {
          return done();
        }
        return done(new Error('Wrong response code'));
      });
    });
  });
});
