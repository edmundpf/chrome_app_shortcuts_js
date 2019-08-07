var bullet, iconNameGen, stringContains, uuid;

uuid = require('uuid/v1');

//: Bullet Print
bullet = function(text) {
  return console.log(`• ${text}`);
};

//: Check if string contains list of substrings
stringContains = function(text, items) {
  var i, j, ref;
  for (i = j = 0, ref = items.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
    if (items[i].includes('.')) {
      items[i] = `\\${items[i]}`;
    }
  }
  return new RegExp(items.join('|')).test(text);
};

//: Icon Name Generator
iconNameGen = function() {
  return `./icons/${uuid()}.ico`;
};

//: Exports
module.exports = {
  bullet: bullet,
  stringContains: stringContains,
  iconNameGen: iconNameGen
};

//::: End Program :::
