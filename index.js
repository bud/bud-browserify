var browserify = require('browserify');
var fs = require('fs');
var path = require("path");

plugin.build = true;
plugin.title = 'Browserify';
plugin.params = [
  { name: 'Entry', desc: 'Path to the entry module.' },
  { key: 'output', name: 'Output file',  desc: 'Path to the file to be written for output.' },
  { name: 'Transforms', desc: 'e.g: babelify, brfs', list: true },
  { name: 'Plugins', desc: 'e.g: foo, bar', list: true }
];

module.exports = plugin;

function plugin (options) {
  return function (b) {
    var debug = !!b.params.debug;
    var build = browserify(options.entry, {
      extensions: ['.jsx'],
      debug: debug
    });

    options.transforms && (options.transforms.forEach(function (name) {
      if (!name.trim()) return;
      build.transform(require(path.join(process.cwd(), 'node_modules', name)));
    }));

    options.plugins && (options.plugins.forEach(function (name) {
      if (!name.trim()) return;
      build.plugin(require(path.join(process.cwd(), 'node_modules', name)));
    }));

    build
      .bundle()
      .on('error', b.error)
      .on('end', b.done)
      .pipe(fs.createWriteStream(options.output));
  };
}
