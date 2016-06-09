
var path = require('path');

module.exports = {
    devServer: {
        host: 'localhost',
        port: 3000,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    },
    entry: './src/app',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
               presets: ['es2015-loose']
           }
        }]
    }
};
