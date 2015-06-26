var browserify = require('browserify');
var fs = require('fs');

plugin.build = true;
plugin.title = 'Browserify';
plugin.params = [
  { name: 'Entry module', description: 'Entry file of the NPM project that will be browserified.' },
  { name: 'Destination file', description: 'Path to the file to be written for output.' }
];

module.exports = plugin;

function plugin (entry, dest) {
  return function (b) {
    browserify(entry).bundle().on('error', b.error).on('end', b.done).pipe(fs.createWriteStream(dest));
  };
}
