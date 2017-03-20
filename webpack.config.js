var webpack = require('webpack');
var path = require('path');
var DashboardPlugin = require('webpack-dashboard/plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: "source-map",
  entry: [
    'webpack/hot/only-dev-server',
    './src'
  ],
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    },
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: "css-loader",
      })
    }]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output: {
    path: path.resolve(__dirname, 'dist/assets'),
    publicPath: '/assets/js',
    filename: 'js/base.js'
  },
  devServer: {
    contentBase: './src',
    publicPath: '/assets/',
    port: 8081,
    historyApiFallback: true,
    hot: true,
    public: 'localhost:8081',
    proxy: {
      "/assets/php": "http://localhost/realpicks2"
    }
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new ExtractTextPlugin('css/base.css'),
    new DashboardPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 8081,
      proxy: 'http://localhost:8081/'
    })
  ]
}
