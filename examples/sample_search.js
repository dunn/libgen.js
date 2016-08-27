const libgen = require('libgen');

const options = {
  mirror: 'http://gen.lib.rus.ec',
  query: 'philosophy of religion',
  count: 5
};
libgen.search(options, (err, data) => {
  if (err)
    return console.error(err);
  let n = data.length;
  console.log('top ' + n + ' results for "' +
             options.query + '"');
  while (n--){
    console.log('***********');
    console.log('Title: ' + data[n].title);
    console.log('Author: ' + data[n].author);
    console.log('Download: ' +
                'http://gen.lib.rus.ec/book/index.php?md5=' +
                data[n].md5.toLowerCase());
  }
});
