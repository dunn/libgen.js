const FSPersister = require("@pollyjs/persister-fs")
const NodeHttpAdapter = require("@pollyjs/adapter-node-http")
const path = require("path")
const { Polly, setupMocha: setupPolly } = require("@pollyjs/core")
Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

const assert = require("assert").strict
const getMirror = require("../../lib/speed.js").mirror
const hasField = require("../../lib/check.js")
const latest = require("../../lib/latest.js")
const random = require("../../lib/random.js")
const search = require("../../lib/search.js")

// get a working mirror and use that for the rest of the tests
let mirror

describe("mirrors.js", () => {
  setupPolly({
    adapters: ["node-http"],
    persister: "fs",
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, "recordings")
      }
    },
    recordFailedRequests: true
  })

  it("should return a working mirror base URL", async () => {
    try {
      mirror = await getMirror()

      if (!mirror){
        assert(false, "getMirror() returned an empty string")
      }
      console.log("Using " + mirror);
      assert(true)
    } catch (err) {
      assert(false, err)
    }
  })

  describe("latest.id", () => {
    it("should return a number over 1282650", async () => {
      try {
        const data = await latest.id(mirror)

        if (!parseInt(data))
          assert(false, "Returned a NaN")

        if (parseInt(data) < 1282650)
          assert(false, `Number returned (${data}) is too low`)

        assert(true)
      } catch (err) {
        assert(false)
      }
    })
  })

  describe("latest.text", () => {
    it("should return a JSON object", async () => {
      try {
        const data = await latest.text(mirror)
        assert.ok(data)
      } catch (err) {
        assert (false)
      }
    })
  })

  describe("random.text", () => {
    it("should return one JSON object", async () => {
      const opts = {
        count: "honk",
        mirror: mirror
      }

      try {
        const data = await random.text(opts)
        assert.equal(data.length, 1, "did not return 1 text")
      } catch (err) {
        assert(false)
      }
    })

    it("should return a PDF from 2000 with a Title", async () => {
      const opts = {
        mirror: mirror,
        fields: [
          "Title",
          { year: "2000",
            extension: "pdf" }
        ]
      }

      try {
        const data = await random.text(opts)

        assert.equal(data.length, 1, "did not receive 1 text")
        assert.ok(hasField(data[0], "title"), "text is missing Title")
        assert.ok(hasField(data[0], "year", "2000"), `text has Year ${data[0].year}`)
        assert.ok(hasField(data[0], "extension", "pdf"), `text is a ${data[0].extension}`)

      } catch (err) {
        assert(false, err)
      }
    })
  })

  describe("search.js", () => {
    it("should return an array of 30 JSON objects", async () => {
      const options = {
        mirror: mirror,
        query: "math",
        count: 30,
        search_in: "series"
      }

      try {
        const data = await search(options)
        assert.equal(data.length, 30)
      } catch (err) {
        assert(false)
      }
    })

    it("should return an array of 10 JSON objects", async () => {
      const options = {
        mirror: mirror,
        query: "math",
        count: 0
      }

      try {
        const data = await search(options)
        assert.equal(data.length, 10)
      } catch (err) {
        assert(false)
      }
    })
  })
})
