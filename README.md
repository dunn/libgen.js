[![Build Status](https://travis-ci.org/dunn/libgen.js.svg?branch=master)](https://travis-ci.org/dunn/libgen.js)

# `libgen`

This is a Node/io.js wrapper for the
[Library Genesis](http://gen.lib.rus.ec) API, with search built on top
of it.

Requires Node.js 4 or higher.

**Reminder:** Library Genesis (with which I am not affiliated) is
asking for donations to support maintenance costs and to establish new
mirrors: <http://gen.lib.rus.ec/donate/>.

## installation

```
npm install [--save] libgen
```

## first, a warning

The Library Genesis maintainers very kindly made a public API that
doesn't require an API key to use, so don't abuse it or they might
change that.

In any case, if you make too many requests in a short period of time
they'll temporarily block your IP address, so go slow for your own
good as well.

## usage: choosing a mirror

This method tests the mirrors in `available_mirrors.js` (currently
`http://libgen.io` and `http://gen.lib.rus.ec`) and returns the one
that is fastest.

```js
libgen.mirror(function(err,urlString){
  if (err)
    return console.error(err);
  return console.log(urlString + ' is currently fastest');
});
```

## usage: searching

The search method has two required options, and a number of optional ones:

- **mirror**—One of the mirrors in `available_mirrors.js`
- **query**—The string to search for.
- **count** (optional)—The number of results to return; defaults to 10.
- **search_in** (optional)—Restrict your search to one of the
  following fields:
    - `title`
    - `author`
    - `series`
    - `periodical`
    - `publisher`
    - `year`
    - `identifier`
    - `md5`
    - `extension`
    - `def` (default; all fields)
- **sort_by** (optional)—The field by which the results are sorted:
    - `title`
    - `publisher`
    - `year`
    - `pages`
    - `language`
    - `filesize`
    - `extension`
    - `def` (default; sorted by relevance)
- **reverse** (optional)—If `false`, sorts from A–Z or 0–9
  (depending on whether `sort_by` is a text or number field);
  when `true` sorts Z–A or 9–0.  Defaults to `false`.

Pass the options to the function as an object:

```js
const options = {
  mirror: 'http://gen.lib.rus.ec',
  query: 'cats',
  count: 5,
  sort_by: 'year',
  reverse: true
};
```

Then do the thing:

```js
libgen.search(options, (err, data) => {
  if (err)
    return console.error(err);
  let n = data.length;
  console.log(n + ' most recently published "' +
             options.query + '" books');
  while (n--){
    console.log('***********');
    console.log('Title: ' + data[n].title);
    console.log('Author: ' + data[n].author);
    console.log('Download: ' +
                'http://gen.lib.rus.ec/book/index.php?md5=' +
                data[n].md5.toLowerCase());
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

This method requires a URL string—one of the mirrors in
`available_mirrors.js`

```js
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
```

You can also do `libgen.latest.id` in the same style—that just returns
a number, corresponding to the LibGen ID of the most recently added
text.

## usage: random texts

This has two required options, and an optional third:

- **mirror**—One of the mirrors in `available_mirrors.js`
- **count**—The number of texts to return.
- **fields** (optional)—An array containing the metadata fields that
  must be set for each text returned; there are
  [52 metadata fields](http://megr.im/posts/libgen/#toc_1 "The Library
  Genesis API (scroll down a bit)"), but some are rarely used.  The
  array can include strings, corresponding to fields that must have
  *some* setting, or objects with Key/Value corresponding to the field
  and the value that field must have (example below).  Keep in mind
  that requests that have multiple required fields will take
  exponentially more time to complete.

Put the options in an object:

```js
const options = {
  mirror: 'http://gen.lib.rus.ec',
  count: 5,
  fields: [ 'title',
            { language: 'English' } ]
};
```

Then pass the object to `libgen.random.text`:

```js
libgen.random.text(options, (err,data) => {
  if (err)
    return(err);
  let n = data.length;
  console.log(n + ' random English-language texts with titles');
  while (n--){
    console.log('***********');
    console.log('Title: ' + data[n].title);
    console.log('Author: ' + data[n].author);
    console.log('Download: ' +
                'http://gen.lib.rus.ec/book/index.php?md5=' +
                data[n].md5.toLowerCase());
  }
});
```

## usage: utilities

A handful of utility methods are available for checking and cleaning
output.

### check.hasField (synchronous)

```js
const isGood = libgen.utils.check.hasField(json,field[,value]);
```

- **array**—A LibGen JSON object.
- **field**—One of the metadata fields.
- **value** (optional)—the value of the specified metadata field.

If a `value` is given, this method returns `true` just in case the
specified field of the JSON object is set to `value`.  Otherwise it
returns true just in case the specified field is set at all.  All
other cases return `false`.

### check.canDownload (asynchronous)

Given a LibGen JSON object or just an MD5, this method returns the
download URL of a text just in case there's a direct download link
available:

```js
const md5 = 'ec1b68f07f01c7e4fb7a8c6af2431cd6';
libgen.utils.check.canDownload(md5, (err, url) => {
  if (err)
    return console.error(err);
  return console.log('Working link: ' + url);
});
```

Note that even if this method returns an error, the text may be
available at one of
[the mirrors that do not offer direct download links](http://megr.im/posts/libgen/
"Scroll down past the first example").

### clean.forFields (synchronous)

Given a LibGen JSON object or an array of objects, this method removes
any that don't have the specified fields and/or field values:

```js
const cleaned = libgen.utils.clean.forFields(json,fields);
```

Pass an array of strings and/or objects to `fields`, as in
`random.text` above.

### clean.dups (synchronous)

Given an array of LibGen JSON objects, this method returns all unique
elements in the array:

```js
const uniques = libgen.utils.clean.dups(array);
```

## license

The MIT License (MIT)

Copyright (c) 2014–2015 Alex Dunn

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
