const path = require('path')
const themeObj = require('./styleguide/theme.js')

module.exports = {
	// set your styleguidist configuration here
	title: 'Default Style Guide',
	// components: 'src/components/**/[A-Z]*.vue',
	components: 'packagesDoc/**/*.vue',
	require: [path.join(__dirname, 'styleguide/global.requires.js')], // 全局vue组件使用的插件
	theme: themeObj,
	// defaultExample: true,
	// sections: [
	//   {
	//     name: 'First Section',
	//     components: 'src/components/**/[A-Z]*.vue'
	//   }
	// ],
	// webpackConfig: {
	//   // custom config goes here
	// },
	exampleMode: 'expand'
}
