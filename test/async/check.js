var assert = require('assert');
var check = require('../../lib/check.js');

var goodMd5 = 'c95589cd1b9dfbd919b3d1b6a5665673';
var badMd5 = '8e69614e79fd09ccdc60honkhonk';
var badJson = require('../json/404.json');

describe('check.js',function(){
  describe('canDownload()',function(){
    it('should return a url string',function(done){
      check.canDownload(goodMd5,function(err,response){
        if (typeof response === 'string') {
          return done();
        }
        return done(new Error('Wrong response'));
      });
    });
    it('should return a 404',function(done){
      check.canDownload(badMd5,function(err,response){
        if (err) {
          return done();
        }
        return done(new Error('Wrong response code'));
      });
    });
    it('should return a 404',function(done){
      check.canDownload(badJson,function(err,response){
        if (err) {
          return done();
        }
        return done(new Error('Wrong response code'));
      });
    });
  });
});
