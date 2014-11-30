var libgen = require('libgen');

var options = {
  mirror: 'http://libgen.org',
  count: 5,
  fields: ['Title',
           { Language: 'English' }
          ]
};

libgen.random.text(options,function(err,data){
  if (err) return console.error(err);
  var n = data.length;
  console.log(n + ' random English-language texts with titles');
  while (n--){
    console.log('***********');
    console.log('Title: ' + data[n].Title);
    console.log('Author: ' + data[n].Author);
    console.log('Download: ' +
                'http://libgen.org/get.php?md5=' +
                data[n].MD5.toLowerCase());
  }
});
