function isIn(elem,array){
  return array.some(function(value,index,array){
    return elem === value;
  });
}

function hasFields(json,fields){
  if (Array.isArray(fields)){
    var n = fields.length;
    while (n--){
      for (var l in json){
        if (isIn(l,fields) && /^\s*$/.test(json[l])){
          return false;
        }
      }
    }
  }
  else if (typeof fields === 'object'){
    for (var key in fields){
      if (json[key] !== undefined && json[key] !== fields[key]){
          return false;
      }
    }
  }
  else {
    for (var k in json){
      if (k === fields && /^\s*$/.test(json[k])){
        return false;
      }
    }
  }
  return json;
}

module.exports = {
  // removes texts that don't have the specified fields
  forFields: function(json,fields){
    if (((typeof json) === 'object') && !Array.isArray(json)){
      return hasFields(json,fields);
    }
    else if (Array.isArray(json)){
      var spliced = [];
      var n = json.length;
      while (n--){
        if (hasFields(json[n],fields)){
          spliced.push(json[n]);
        }
      }
      if (spliced.length) {
        return spliced;
      }
      else {
        return false;
      }
    }
    else {
      return console.error(
        new Error('Bad data passed to clean.forFields()'));
    }
  },
  // removes duplicate texts from an array of libgen json objects
  dups: function(array){
    var sorted = array.sort(function(a,b){
      return a.ID - b.ID;
    });
    var i = sorted.length - 1;
    while (i--) {
      if (sorted[i + 1].ID === sorted[i].ID) {
        sorted.splice(i,1);
      }
    }
    return sorted;
  }
};
