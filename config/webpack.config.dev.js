const webpack = require('webpack')
const path = require('path')

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const loaders = require('./loaders.js')

loaders.push({
    test: /\.css$/,
    use: [
        { loader: 'style-loader', options: { insertInto: 'body' } },
        { loader: 'css-loader' },
    ],
})

module.exports = {
  entry: {
    index: [
      'react-hot-loader/patch',
      require.resolve('webpack-dev-server/client') + '?/', // eslint-disable-line prefer-template
      require.resolve('webpack/hot/dev-server'),
      './app/index.js'
    ],
  },
  output: {
    path: path.resolve(__dirname, '..', './public/'),
    pathinfo: true,
    filename: 'hello.js',
    publicPath: '/',
  },
  devtool: 'eval',
  devServer: {
    historyApiFallback: true,
    hot: true
  },
  module: {
    loaders
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: './template/index.html',
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
}
