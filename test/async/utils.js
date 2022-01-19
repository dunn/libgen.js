const FSPersister = require("@pollyjs/persister-fs")
const NodeHttpAdapter = require("@pollyjs/adapter-node-http")
const path = require("path")
const { Polly, setupMocha: setupPolly } = require("@pollyjs/core")
Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

const assert = require("assert").strict
const check = require("../../index.js").utils.check

const md5 = "c95589cd1b9dfbd919b3d1b6a5665673"

describe("utils", () => {
  setupPolly({
    mode: process.env.VCR_MODE || 'replay',

    adapters: ["node-http"],
    persister: "fs",
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, "recordings")
      }
    },
    recordFailedRequests: true
  })

  describe("canDownload()", () => {
    it("should return a url string", async () => {
      const response = await check.canDownload(md5)
      assert(response)
    })
  })
})
