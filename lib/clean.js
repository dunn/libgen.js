'use strict';

function isIn(elem, array){
  return array.some((value, index, array) => {
    return elem === value;
  });
}

function hasFields(json, fields){
  if (Array.isArray(fields)) {
    let n = fields.length;
    while (n--)
      for (var l in json)
        if (isIn(l, fields) && /^\s*$/.test(json[l]))
          return false;
  }
  else if (typeof fields === 'object') {
    for (var key in fields)
      if (json[key] !== undefined && json[key] !== fields[key])
          return false;
  }
  else {
    for (var k in json)
      if (k === fields && /^\s*$/.test(json[k]))
        return false;
  }
  return json;
}

module.exports = {
  // removes texts that don't have the specified fields
  forFields: function(json, fields) {
    if (((typeof json) === 'object') && !Array.isArray(json))
      return hasFields(json,fields);
    else if (Array.isArray(json)) {
      var spliced = [];
      var n = json.length;
      while (n--)
        if (hasFields(json[n],fields))
          spliced.push(json[n]);

      if (spliced.length)
        return spliced;
      else
        return false;
    }
    else
      return console.error(new Error('Bad data passed to clean.forFields()'));
  },
  // removes duplicate texts from an array of libgen json objects
  dups: function(array) {
    let sorted = array.sort((a, b) => {
      return a.id - b.id;
    });
    let i = sorted.length - 1;
    while (i--)
      if (sorted[i + 1].id === sorted[i].id)
        sorted.splice(i,1);

    return sorted;
  }
};
