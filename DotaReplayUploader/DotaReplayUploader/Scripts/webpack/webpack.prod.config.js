var webpack = require('webpack');
var path = require('path');

var parentDir = path.join(__dirname, '../');

module.exports = {
    entry: [
        path.join(parentDir, 'index.js')
    ],
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            loader: 'babel-loader'
        }, {
            test: /\.css$/,
            loaders: ["style-loader", "css-loader", "less-loader"]
        }, {
            test: /\.(png|jp(e*)g|svg)$/,  
            loader: 'file-loader'
        }
        ]
    },
    output: {
        path: parentDir,
        filename: 'bundle.js',
        publicPath: '/'
    },
    devtool: 'source-map'
}