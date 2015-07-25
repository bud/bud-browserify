var browserify = require('browserify');
var fs = require('fs');
var path = require("path");

plugin.build = true;
plugin.title = 'Browserify';
plugin.params = [
  { name: 'Entry module', desc: 'Entry file of the NPM project that will be browserified.' },
  { name: 'Destination file', desc: 'Path to the file to be written for output.' },
  { name: 'Transforms', desc: 'e.g: babelify, brfs' },
  { name: 'Plugins', desc: 'e.g: foo, bar' }
];

module.exports = plugin;

function plugin (entry, dest, transforms, plugins) {
  return function (b) {
    var debug = !!b.params.debug;
    var build = browserify(entry, {
      extensions: ['.jsx'],
      debug: debug
    });

    transforms && (transforms.split(',').forEach(function (name) {
      if (!name.trim()) return;
      build.transform(require(path.join(process.cwd(), 'node_modules', name)));
    }));

    plugins && (plugins.split(',').forEach(function (name) {
      if (!name.trim()) return;
      build.plugin(require(path.join(process.cwd(), 'node_modules', name)));
    }));

    build
      .bundle()
      .on('error', b.error)
      .on('end', b.done)
      .pipe(fs.createWriteStream(dest));
  };
}
