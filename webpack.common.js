const path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    entry: {
        panel: './src/panel.js',
        config: './src/config.js',
        mobile: './src/mobile.js',
        video_overlay: './src/video_overlay.js',
        authorization: './src/authorization.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({})],
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: 'initial',
                    name: 'vendor',
                    test: 'vendor',
                    enforce: true,
                },
            },
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'config.html',
            template: 'src/assets/html/config.html',
            chunks: ['config'],
        }),
        new HtmlWebpackPlugin({
            filename: 'live_config.html',
            template: 'src/assets/html/live_config.html',
            chunks: ['config'],
        }),
        new HtmlWebpackPlugin({
            filename: 'panel.html',
            template: 'src/assets/html/panel.html',
            chunks: ['panel'],
        }),
        new HtmlWebpackPlugin({
            filename: 'mobile.html',
            template: 'src/assets/html/mobile.html',
            chunks: ['mobile'],
        }),
        new HtmlWebpackPlugin({
            filename: 'video_overlay.html',
            template: 'src/assets/html/video_overlay.html',
            chunks: ['video_overlay'],
        }),
        new HtmlWebpackPlugin({
            filename: 'authorization.html',
            template: 'src/assets/html/authorization.html',
            chunks: ['authorization'],
        }),
        new MiniCssExtractPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: ['@babel/plugin-proposal-optional-chaining'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    // Creates `style` nodes from JS strings and extracts CSS into the output directory
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    'css-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                // Resolve images and emit into the assets directory
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                            name: '[name].[ext]',
                            outputPath: 'assets',
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        alias: {
            react: 'preact/compat',
            'react-dom': 'preact/compat',
        },
    },
};
