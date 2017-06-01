module.exports = function (json, field, value) {
  if (/^\s*$/.test(json[field.toLowerCase()]))
    return false
  else if (value)
    return json[field.toLowerCase()] === value
  else
    return true
}
