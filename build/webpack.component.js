const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const Components = require('./get-components')();


const entry = {};
Components.forEach(c => {
  entry[c] = `./packages/${c}/index.js`;
});
const webpackConfig = {
  mode: 'production',
  entry,
  output: {
    path: path.resolve(process.cwd(), './lib'),
    filename: '[name].js',
    chunkFilename: '[id].js',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias:  {
      main: path.resolve(__dirname, '../src'),
      packages: path.resolve(__dirname, '../packages'),
      examples: path.resolve(__dirname, '../examples'),
      'boss-lib': path.resolve(__dirname, '../')
    },
    modules: ['node_modules']
  },
  externals: {
    vue: 'vue',
    // 'boss-lib/packages/plugins': 'boss-lib/packages/plugins'
  },
  stats: 'none',
  optimization: {
    minimize: false
  },
  performance: {
    hints: false
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    },  {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        compilerOptions: {
          preserveWhitespace: false
        }
      }
    },
    {test: /\.scss$/, use: ["style-loader",'css-loader','sass-loader']},
    {
      test: /\.css$/,
      loaders: ['style-loader', 'css-loader']
    },
    {
      test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: path.posix.join('static', '[name].[hash:7].[ext]')
      }
    }]
  },
  plugins: [
    new ProgressBarPlugin(),
    new VueLoaderPlugin()
  ]
};

module.exports = webpackConfig;
