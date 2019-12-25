const assert = require("assert").strict
const check = require("../../index.js").utils.check

const goodMd5 = "c95589cd1b9dfbd919b3d1b6a5665673"
const badMd5 = "8e69614e79fd09ccdc60honkhonk"
const badJson = require("../json/404.json")

describe("check.js", () => {
  describe("canDownload()", () => {
    it("should return a url string", async () => {
      const response = await check.canDownload(goodMd5)
      assert(response)
    })

    it("should return a 404", async () => {
      try {
        await check.canDownload(badMd5)
        assert(false, `${badMd5} should return error`)
      } catch (err) {
        assert(true)
      }
    })

    it("should return a 404", async () => {
      try {
        await check.canDownload(badJson)
        assert(false, "Bad JSON should not return good response")
      } catch (err) {
        assert(true)
      }
    })
  })
})
