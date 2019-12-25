const libgen = require('../index.js');

(async () => {
  try {
    const text = await libgen.latest.text('http://libgen.is')
    console.log('Last text uploaded to Library Genesis')
    console.log('***********')
    console.log('Title: ' + text.title)
    console.log('Author: ' + text.author)
    console.log('Download: ' +
                'http://libgen.is/book/index.php?md5=' +
                text.md5.toLowerCase())
    return true
  } catch(err) {
      return console.dir(err)
  }
})();
