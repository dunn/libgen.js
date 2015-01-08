var libgen = require('libgen');
var opts = {
  count: 10,
  mirror: 'http://gen.lib.rus.ec'
};
libgen.random.text(opts,function(err,data){
  if (err) return(err);
  var n = data.length;
  console.log(n + ' random texts');
  while (n--){
    console.log('***********');
    console.log('Title: ' + data[n].Title);
    console.log('Author: ' + data[n].Author);
    console.log('Download: ' +
                'http://gen.lib.rus.ec/book/index.php?md5=' +
                data[n].MD5.toLowerCase());
  }
});
