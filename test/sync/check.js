const assert = require("assert").strict

const hasField = require("../../lib/check.js")
const single = require("../json/single.json")

describe("hasField", () => {
  it("should find 25 filled fields", () => {
    let c = 0
    for (let key in single){
      if (hasField(single, key)) {
        c++
      }
    }
    assert.equal(c, 25)
  })

  it("should return true", () => {
    const yearField = hasField(single, "year", "1998")
    assert.ok(yearField)
  })

  it("should return false", () => {
    const yearField = hasField(single, "year", "1990")
    assert.ok(!yearField)
  })
})
