# `libgen`

This is a wrapper for the [Library Genesis](http://libgen.org) API,
with search built on top of it.

## installation

```
npm install [--save] libgen
```

## usage: choosing a mirror

Queries can be made against either `http://libgen.org` or
`http://gen.lib.rus.ec`.  You can either manually select one and pass
it to a method, or use `libgen.mirror()` to select the one that's
currently faster:

```js
libgen.mirror(function(err,urlString){
  if (err) return callback(err);
  return callback(null,urlString);
});
```

(This might take a few seconds itself, though.)

## usage: searching

The search method takes three options:

- **mirror**—either `http://libgen.org` or `http://gen.lib.rus.ec`
- **query**—the string to search for
- **count**—the number of results to return; defaults to 10

Pass the options to the function as an object:

```js
var options = {
  mirror: 'http://libgen.org',
  query: 'cats',
  count: 5
};
```

Then do the thing:

```js
libgen.search(options,function(err,data){
  if (err) return console.error(err);
  var n = data.length;
  console.log('top ' + n + ' results for "' +
             options.query + '"');
  while (n--){
    console.log('***********');
    console.log('Title: ' + data[n].Title);
    console.log('Author: ' + data[n].Author);
    console.log('Download: ' +
                'http://libgen.org/get?md5=' +
                data[n].MD5.toLowerCase());
  }
});
```

`libgen` returns the full JSON objects
[provided by the API](http://megr.im/posts/libgen/ "A guide to the
Library Genesis API"), though many of the metadata fields will be
empty for any given text.

Search is not very fast, partly because the `search` method always
makes at least two HTTP requests: at least one during the initial
search (more than one if we need to work through multiple pages of
results), then another where we send the IDs—scraped from the search
results page—to the API.  We could get most of the metadata from the
search page without then going to the API, but this way the behavior
is consistent between `search` and the other methods; all return the
same full JSON objects.

## usage: latest upload

This method just requires a URL string—either `http://libgen.org` or
`http://gen.lib.rus.ec`.

```js
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
```

You can also do `libgen.latest.id` in the same style—that just returns
a number, corresponding to the LibGen ID of the most recently added
text.

## usage: random texts

This takes two options:

- **mirror**—either `http://libgen.org` or `http://gen.lib.rus.ec`
- **count**—number of texts to return

Put the options in an object:

```js
var options = {
  mirror: 'http://libgen.org',
  count: 5
};
```

Then pass the object to `libgen.random.text`:

```js
libgen.random.text(opts,function(err,data){
  if (err) return(err);
  var n = data.length;
  console.log(n + ' random texts');
  while (n--){
    console.log('***********');
    console.log('Title: ' + data[n].Title);
    console.log('Author: ' + data[n].Author);
    console.log('Download: ' +
                'http://libgen.org/get?md5=' +
                data[n].MD5.toLowerCase());
  }
});
```

## license

The MIT License (MIT)

Copyright (c) 2014 Alex Dunn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
