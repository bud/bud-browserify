var browserify = require('browserify');
var watchify = require("watchify");
var fs = require('fs');
var path = require("path");
var mix = require("mix-objects");

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
  var watching;
  var build = browserify(mix({}, [
    options.watch ? watchify.args : null, options.options,
    { entries: [options.entry], debug: !!options.debug }
  ]));

  options.transforms && (options.transforms.forEach(function (transform) {
    build.transform(grab(transform));
  }));

  options.plugins && (options.plugins.forEach(function (plugin) {
    build.plugin(grab(plugin));
  }));

  return function (task) {
    var target = fs.createWriteStream(options.output);
    var bundle = build.bundle().on('error', task.error).on('end', task.done);

    target.on('error', task.error);
    bundle.pipe(target);

    if (options.watch && !watching) {
      watching = true;
      build = watchify(build);
      build.on('update', task.run);
    }
  };
}

function grab (dependency) {
  if (typeof dependency != "string") return dependency;
  return require(path.join(process.cwd(), 'node_modules', dependency));
}
