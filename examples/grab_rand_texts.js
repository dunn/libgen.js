const libgen = require('libgen');
const opts = {
  count: 10,
  mirror: 'http://gen.lib.rus.ec'
};
libgen.random.text(opts, (err, data) => {
  if (err)
    return(err);
  let n = data.length;
  console.log(n + ' random texts');
  while (n--){
    console.log('***********');
    console.log('Title: ' + data[n].title);
    console.log('Author: ' + data[n].author);
    console.log('Download: ' +
                'http://gen.lib.rus.ec/book/index.php?md5=' +
                data[n].md5.toLowerCase());
  }
});
