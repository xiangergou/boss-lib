const fs = require('fs');
const path = require('path');
var nodeExternals = require('webpack-node-externals');

const excludes = [
  'index.js',
  'theme-chalk',
  'mixins',
  'utils',
  'fonts',
  'images',
  '.DS_Store',
  'plugins'
];

const components = function () {
  const dirs = fs.readdirSync(path.resolve(__dirname, '../packages'));
  return dirs.filter(dirName => excludes.indexOf(dirName) === -1);
};

const utilsList = fs.readdirSync(path.resolve(__dirname, '../src/utils'));

var externals = {};

utilsList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`boss-lib/src/utils/${file}`] = `boss-lib/lib/utils/${file}`;
});

components().forEach(function(key) {
  externals[`boss-lib/packages/${key}`] = `boss-lib/lib/${key}`;
});


externals = [Object.assign({
  vue: 'vue',
  VXETablePluginExcel: 'vxe-table-plugin-excel',
  XEUtils: 'xe-utils',
  VXETable: 'vxe-table',
  VXETablePluginExportXLSX: 'vxe-table-plugin-export-xlsx',
  XEClipboard: 'xe-clipboard',
  VXETablePluginElement: 'vxe-table-plugin-element',
  VXETablePluginMenus: 'vxe-table-plugin-menus',
  Sortable: 'sortablejs',
  jsoneditor: 'jsoneditor',
  'file-saver': 'file-saver'
}, externals), nodeExternals()];


exports.components = components()

exports.externals = externals;

exports.alias = {
  main: path.resolve(__dirname, '../src'),
  packages: path.resolve(__dirname, '../packages'),
  examples: path.resolve(__dirname, '../examples'),
  'boss-lib': path.resolve(__dirname, '../')
};


