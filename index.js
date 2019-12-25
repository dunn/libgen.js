module.exports = {
  mirror: require("./lib/speed.js").mirror,
  latest: require("./lib/latest.js"),
  random: require("./lib/random.js"),
  search: require("./lib/search.js"),
  utils: {
    clean: require("./lib/clean.js"),
    check: {
      hasField: require("./lib/check.js"),
      canDownload: require("./lib/speed.js").canDownload
    }
  }
};
