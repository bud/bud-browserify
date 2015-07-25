## bud-browserify

Browserify plugin for Bud

## Install

```bash
$ npm install bud-browserify
```

## Usage

```js
var build = require('bud');

build("dist/build.js", browserify("index.js", "dist/build.js"));
```
