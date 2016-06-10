let path = require('path');

module.exports = {
    devServer: {
        host: '0.0.0.0',
        port: 3000,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    },
    entry: './src/index',
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
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }]
    }
};
