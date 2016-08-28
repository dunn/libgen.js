# 1.0.0

- **semver-major:** use ES6 features requiring Node 4+

- **semver-major:** change default count for `random.text` from 10 to 1

- libgen has started returning JSON objects with lowercase keys;
  update code and tests to match

# 0.4.4

- update request and async dependencies; loosen version specifications

# 0.4.3

- replace libgen.in with libgen.io

# 0.4.2

- update request dependency

# 0.4.1

- better error handling in `lib/mirror.js`
- avoid 414 errors from over-long URLs in `lib/random.js`

# 0.4.0

- Add support for new `libgen.in` mirror
- Available mirrors stored in `available_mirrors.js` for easy updating

# 0.3.5

- deactivate http://libgen.org mirror (see <https://github.com/dunn/libgen.js/issues/2>)
- search method checks for minimum query length (4 characters)

# 0.3.4

- Correctly handle complicated required-fields options
- treat IDs as strings rather than integers

# 0.3.3

- Direct download URLs changed from `http://libgen.org/get?md5=`
  to `http://libgen.org/get.php?md5=`

# 0.3.2

- general cleanup
- removed `moment` dependency

# 0.3.1

- fixed readme regarding how the `reverse` sorting option works

# 0.3.0

- more search options: `search_in`, `sort_by`, `reverse` (sort)
- removed `cheerio` dependency

# 0.2.2

- tweaked README
- bumped allowed `request` version

# 0.2.1

- clearer README
- bumped allowed `mocha` version

# 0.2.0

- allow field restrictions with `random.text`: can demand only results
with given fields filled, or filled with a particular value
- add utility methods `check.hasField`, `check.canDownload`,
  `clean.forFields`, `clean.dups`

# 0.1.0

- initial release
