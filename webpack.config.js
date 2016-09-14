var webpack = require('webpack');

module.exports = {
    devtool: "source-map",
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        './src/index.js'
],
module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
},
resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: 'dist/assets/js',
        publicPath: '/assets/js',
        filename: 'base.js'
    },
    devServer: {
        contentBase: './dist',
        hot: true
},
plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
        },
      })
    ]
};
