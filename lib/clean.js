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
    return json;
  }
  else {
    for (var k in json){
      if (k === fields && /^\s*$/.test(json[k])){
        return false;
      }
    }
    return json;
  }
}

// removes texts that don't have the specified fields
module.exports = function(json,fields){
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
    return console.error(new Error('Bad data passed to clean()'));
  }
};
