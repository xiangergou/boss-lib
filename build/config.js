var path = require('path');
var fs = require('fs');
var nodeExternals = require('webpack-node-externals');
var Components = require('../packages/index.js');

var utilsList = fs.readdirSync(path.resolve(__dirname, '../src/utils'));
// var mixinsList = fs.readdirSync(path.resolve(__dirname, '../src/mixins'));
var transitionList = fs.readdirSync(path.resolve(__dirname, '../src/transitions'));
var externals = {};

Object.keys(Components).forEach(function(key) {
  externals[`boss-lib/packages/${key}`] = `boss-lib/lib/${key}`;
});

externals['boss-lib/src/locale'] = 'boss-lib/lib/locale';
utilsList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`boss-lib/src/utils/${file}`] = `boss-lib/lib/utils/${file}`;
});
// mixinsList.forEach(function(file) {
//   file = path.basename(file, '.js');
//   externals[`boss-lib/src/mixins/${file}`] = `boss-lib/lib/mixins/${file}`;
// });
transitionList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`boss-lib/src/plugins/${file}`] = `boss-lib/lib/plugins/${file}`;
});

externals = [Object.assign({
  vue: 'vue'
}, externals), nodeExternals()];

exports.externals = externals;

exports.alias = {
  main: path.resolve(__dirname, '../src'),
  packages: path.resolve(__dirname, '../packages'),
  examples: path.resolve(__dirname, '../examples'),
  'boss-lib': path.resolve(__dirname, '../')
};

exports.vue = {
  root: 'Vue',
  commonjs: 'vue',
  commonjs2: 'vue',
  amd: 'vue'
};

exports.jsexclude = /node_modules|utils\/popper\.js|utils\/date\.js/;
