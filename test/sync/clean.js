const assert = require("assert").strict
const clean = require("../../lib/clean.js")
const single = require("../json/single.json")
const multiple = require("../json/multiple.json")

describe("clean", () => {
  describe("forFields", () => {
    describe("single text", () => {
      describe("strip if no Publisher (string and array)", () => {
        it("should remove the object and return nothing", () => {
          const empty = !clean.forFields(single, "publisher")
          assert.ok(empty)
        })

        it("should remove the object and return nothing", () => {
          const empty = !clean.forFields(single, ["publisher"])
          assert.ok(empty)
        })
      })

      describe("strip if no Title (string and array)", () => {
        it("should return the object", () => {
          const json = clean.forFields(single, "title")
          assert.equal(typeof json,"object")
        })

        it("should return the object", () => {
          const json = clean.forFields(single, ["title"])
          assert.equal(typeof json, "object")
        })
      })
    })

    describe("multiple texts", () => {
      describe("strip if not Cleaned (string and array)", () => {
        it("should return nothing", () => {
          const empty = !clean.forFields(multiple, "cleaned")
          assert.ok(empty)
        })

        it("should return nothing", () => {
          const empty = !clean.forFields(multiple, ["cleaned"])
          assert.ok(empty)
        })
      })

      describe("strip if not Searchable (string and array)", () => {
        it("should return an array of two texts", () => {
          const json = clean.forFields(multiple, "searchable")
          assert.equal(json.length, 2)
        })

        it("should return an array of two texts", () => {
          const json = clean.forFields(multiple, ["searchable"])
          assert.equal(json.length, 2)
        })
      })

      describe("remove texts that are not Russian from 2002", () => {
        it("should return an array of two texts", () => {
          const json = clean.forFields(multiple, { language: "Russian", year: "2002"})
          assert.equal(json.length, 1)
        })
      })
    })
  })

  describe("dups", () => {
    it("should remove the duplicate object and return an array of length 3", () => {
      const duplicates = require("../json/duplicate.json")
      const cleaned = clean.dups(duplicates)
      assert.equal(cleaned.length, 3)
    })
  })
})
