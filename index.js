var browserify = require('browserify');
var fs = require('fs');
var path = require("path");

plugin.build = true;
plugin.title = 'Browserify';
plugin.hasBuiltinWatch = true;
plugin.params = [
  { title: 'Entry', desc: 'Path to the entry module.' },
  { key: 'output', title: 'Output file',  desc: 'Path to the file to be written for output.' },
  { title: 'Transforms', desc: 'e.g: babelify, brfs', commaList: true },
  { title: 'Plugins', desc: 'e.g: foo, bar', commaList: true },
  { key: 'watch', title: 'Watch for changes?', desc: 'yes/no', bool: true }
];

module.exports = plugin;

function plugin (options) {
  return function (b) {
    var build = browserify(options.entry, options.options || {
      debug: !!b.params.debug
    });

    options.transforms && (options.transforms.forEach(function (transform) {
      build.transform(grab(transform));
    }));

    options.plugins && (options.plugins.forEach(function (plugin) {
      build.plugin(grab(plugin));
    }));

    var target = fs.createWriteStream(options.output);
    target.on('error', b.error);

    build
      .bundle()
      .on('error', b.error)
      .on('end', b.done)
      .pipe(target);
  };
}

function grab (dependency) {
  if (typeof dependency != "string") return dependency;
  return require(path.join(process.cwd(), 'node_modules', dependency));
}
