const libgen = require('../index.js');

(async () => {
  const opts = {
    count: 10,
    mirror: 'http://libgen.is'
  }

  try {
    const data = await libgen.random.text(opts)
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
  } catch (err) {
    console.dir(err)
  }
})();
