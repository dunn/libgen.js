const libgen = require('libgen');

libgen.latest.text('http://gen.lib.rus.ec', (err, text) => {
  if (err)
    return console.error(err);
  console.log('Last text uploaded to Library Genesis');
  console.log('***********');
  console.log('Title: ' + text.title);
  console.log('Author: ' + text.author);
  console.log('Download: ' +
              'http://gen.lib.rus.ec/book/index.php?md5=' +
              text.md5.toLowerCase());
});
