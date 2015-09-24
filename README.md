## bud-browserify

Browserify plugin for Bud

## Install

```bash
$ npm install bud-browserify
```

## Usage

```js
var build = require('bud');
var browserify = require('bud-browserify');

build("dist/build.js", browserify({ entry: "index.js", output: "dist/build.js" }));
```
