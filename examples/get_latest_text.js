var libgen = require('libgen');

libgen.latest.text('http://gen.lib.rus.ec',function(err,text){
  if (err) return console.error(err);
  console.log('Last text uploaded to Library Genesis');
  console.log('***********');
  console.log('Title: ' + text.Title);
  console.log('Author: ' + text.Author);
  console.log('Download: ' +
              'http://libgen.org/get?md5=' +
              text.MD5.toLowerCase());
});
