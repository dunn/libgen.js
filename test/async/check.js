var assert = require('assert')
var check = require('../../index.js').utils.check

var goodMd5 = 'c95589cd1b9dfbd919b3d1b6a5665673'
var badMd5 = '8e69614e79fd09ccdc60honkhonk'
var badJson = require('../json/404.json')

describe('check.js', function() {
  describe('canDownload()', function() {
    it('should return a url string', (done) => {
      check.canDownload(goodMd5, (err, response) => {
        if (typeof response === 'string')
          return done()

        return done(new Error(`Bad response: ${response}`))
      })
    })

    it('should return a 404', (done) => {
       check.canDownload(badMd5, (err, response) => {
        if (err)
          return done()

        return done(new Error(`Bad response: ${response}`))
      })
    })

    it('should return a 404', (done) => {
      check.canDownload(badJson, (err, response) => {
        if (err)
          return done()

        return done(new Error(`Bad response: ${response}`))
      })
    })
  })
})
