var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: "./js/entry.js",
    output: {
        path: __dirname,
        filename: "./pages/bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.(woff2?|svg)$/, loader: 'url?limit=10000' },
            { test: /\.(ttf|eot)$/, loader: 'file' },
            { test: /bootstrap[\/\\]dist[\/\\]js[\/\\]umd[\/\\]/, loader: 'imports?jQuery=jquery' },
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                  presets: ['es2015', 'react']
                }
              }
        ]
    },
    plugins: [
    new webpack.optimize.OccurenceOrderPlugin(), // Optimise plugin load order
    new webpack.DefinePlugin({ // Set production mode
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin() // Remove duplicate bundle bits
  ],
    devtool: 'eval',
    resolve: {
    // you can now require('file') instead of require('file.js')
    extensions: ['', '.js', '.json']
  }
};