const webpack = require('webpack')
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const loaders = require('./loaders.js')

module.exports = ({ analyse }) => {

    const plugins = [
        new HtmlWebpackPlugin({
            inject: true,
            template: './template/index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                useShortDoctype: false,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
            }
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true
            },
            output: { comments: false },
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
    ]

    if (analyse === 'true') {
        plugins.push(new BundleAnalyzerPlugin)
    } else {
        // https://github.com/webpack-contrib/webpack-bundle-analyzer/issues/115
        plugins.push(new webpack.optimize.ModuleConcatenationPlugin)
    }

    return {
        bail: true,
        target: 'web',
        entry: {
            vendor: ['react', 'react-dom'],
            index: './app/index.js',
        },
        output: {
            path: path.resolve(__dirname, '..', './public/'),
            filename: 'hello.[name].[chunkhash:8].js',
            publicPath: '/', // because the intention is to serve from ./public/
        },
        devtool: 'cheap-module-source-map',
        module: {
            loaders
        },
        plugins,
    }
}
