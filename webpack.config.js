const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const config = {
    entry: './example/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'example.bundle.js'
    },
    module: {
        rules: [
            { test: /\.ts$/, use: 'awesome-typescript-loader' },
            { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
            { test: /\.(png|gif|jpg|jpeg)$/, use: 'file-loader' },
            { test: /Cesium\.js$/, use: 'script-loader' }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    plugins: [
        new HtmlWebpackPlugin({template: './example/index.html'}),
        new CopyWebpackPlugin([
            // Copy cesium files to assets folder
            { from: './node_modules/cesium/Build/Cesium', to: './assets/cesium' }
            // Copy cesium unminified files to assets folder
            // { from: './node_modules/cesium/Build/CesiumUnminified', to: 'assets/cesium' }
        ])
    ],
    devtool: 'eval',
    devServer: {
        contentBase: './dist/',
        stats: 'minimal',
        port: 8080
    }
};

module.exports = config;