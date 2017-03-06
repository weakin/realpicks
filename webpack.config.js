var webpack = require('webpack');
var path = require('path');

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
    }]
  },
  resolve: {
        extensions: ['.js', '.jsx']
    },
    output: {
        path: path.resolve(__dirname, 'dist/assets/js'),
        publicPath: '/assets/js',
        filename: 'base.js'
    },
  devServer: {
    contentBase: './dist',
    port: 80,
    historyApiFallback: true,
    hot: true,
    public: 'localhost:80'
  },
plugins: [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
  }),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  })
]
};
