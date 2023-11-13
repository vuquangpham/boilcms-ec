const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const {CORE_DIRECTORY} = require("../core/utils/config.utils");

// dev mode
const IS_DEV_MODE = process.env.DEV_MODE === "true";

// front end
const dirApp = path.join(__dirname, '..', 'app', 'js');
const dirGlobal = path.join(__dirname, '..', 'assets');
const dirShared = path.join(__dirname, '..', 'shared');
const dirPublic = path.join(__dirname, '..', 'public', 'themes');

// backend
const dirAppBE = path.join(CORE_DIRECTORY, 'assets', 'js');

module.exports = {
    entry: {
        'main-fe': path.join(dirApp, 'index.js'),
        'main-be': path.join(dirAppBE, 'index.js'),
    },

    output: {
        path: path.resolve(__dirname, '..', 'public', 'themes'),
        assetModuleFilename: '[name][ext]',
        clean: true,
    },

    resolve: {
        extensions: ['.ts', '.js', '.json'],
        alias: {
            '@fe': dirApp,
            '@be': dirAppBE,
            '@global': dirGlobal
        },
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),

        new CopyWebpackPlugin({
            patterns: [
                {
                    from: dirShared,
                    to: dirPublic,
                    noErrorOnMissing: true
                }
            ]
        }),

        new CleanWebpackPlugin(),
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                },
            },

            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {sourceMap: IS_DEV_MODE},
                    },
                    {
                        loader: "postcss-loader",
                    },
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {sourceMap: IS_DEV_MODE},
                    },
                    {
                        loader: "postcss-loader",
                    },
                    {
                        loader: "sass-loader",
                    },
                ],
            },

            {
                test: /\.(png|jpg|gif|jpe?g|svg|woff2?|fnt|webp|mp4)$/,
                type: 'asset/resource',
                generator: {
                    filename: '[name].[hash].[ext]',
                },
            },

            {
                test: /\.(glsl|frag|vert)$/,
                type: 'asset/source', // replaced raw-loader
                exclude: /node_modules/,
            },
        ],
    },
};