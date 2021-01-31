const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: "none",
    entry: ["babel-polyfill", "./src/index.js"],
    output: {
        path: __dirname + '/dist',
        filename: "bundle.js"
    },
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                        ]
                    }
                }
            },
        ]
    },
    plugins: [new MiniCssExtractPlugin({
        filename: 'bundle.css'
    })]
}