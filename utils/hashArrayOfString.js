var hashStringArray = function(array) {
  return array.sort().join('\u200b');
};

module.exports = hashStringArray