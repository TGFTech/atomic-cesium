const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const cesiumMain = './node_modules/cesium/Source/Cesium';
const cesiumSource = './node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';

const config = {
    entry: './example/main.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'example.bundle.js',
        // Needed to compile multiline strings in Cesium
        sourcePrefix: ''
    },
    amd: {
        // Enable webpack-friendly use of require in Cesium
        toUrlUndefined: true,
    },
    node: {
        // Resolve node module use of fs
        fs: 'empty'
    },
    module: {
        rules: [
            { test: /\.ts$/, use: 'awesome-typescript-loader' },
            { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
            { test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/, use: [ 'file-loader', 'url-loader' ]}
        ]
    },
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            // Cesium module name
            cesium: path.resolve(__dirname, cesiumMain),
            ['cesium-source']: path.resolve(__dirname, cesiumSource)
        }
    },
    plugins: [
        new HtmlWebpackPlugin({template: './example/index.html'}),
        new CopyWebpackPlugin([
            { from: path.join(cesiumSource, cesiumWorkers), to: './assets/cesium/Workers' },
            { from: path.join(cesiumSource, 'Assets'), to: './assets/cesium/Assets' },
            { from: path.join(cesiumSource, 'Widgets'), to: './assets/cesium/Widgets' }
        ]),
        new webpack.DefinePlugin({
            // Define relative base path in cesium for loading assets
            CESIUM_BASE_URL: JSON.stringify('./assets/cesium/')
        })
    ],
    devtool: 'eval',
    devServer: {
        contentBase: './dist/',
        stats: 'minimal',
        port: 8080
    }
};

module.exports = config;