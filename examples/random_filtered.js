const libgen = require("../index.js");

(async () => {
  const options = {
    mirror: "http://libgen.is",
    count: 5,
    fields: [
      "Title",
      { year: "2000",
        extension: "pdf" }
    ]
  }

  try {
    const data = await libgen.random.text(options)
    let n = data.length
    console.log(n + " random PDFs from 2000 with titles")
    while (n--) {
      console.log("")
      console.log("Title: " + data[n].title)
      console.log("Author: " + data[n].author)
      console.log("Year: " + data[n].year)
      console.log("Download: " +
                  "http://gen.lib.rus.ec/book/index.php?md5=" +
                  data[n].md5.toLowerCase())
    }
    return true
  } catch (err) {
    return console.error(err)
  }
})();
