const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const config = require('./config');

const entry = {};
config.components.forEach(c => {
  entry[c] = `./packages/${c}/index.js`;
});

console.log(config)

const webpackConfig = {
  mode: 'production',
  entry,
  output: {
    path: path.resolve(process.cwd(), './lib'),
    filename: '[name].js',
    chunkFilename: '[id].js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias:  config.alias,
    modules: ['node_modules']
  },
  externals: config.externals,
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
        limit: 30 * 1024, // 暂定30k
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
