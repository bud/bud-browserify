var task = require("bud");
var build = task;
var browserify = require("../");

build("build.js", browserify({
  "entry": "index.js",
  "output": "output.js",
  "transforms": [],
  "plugins": [],
  "watch": true
}));