module.exports = [
    {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
            { loader: 'babel-loader', options: { cacheDirectory: true } }
        ]
    },
    {
        test: /\.css$/,
        use: [
            { loader: 'style-loader', options: { insertInto: 'body' } },
            { loader: 'css-loader', options: { modules: true, localIdentName: '[name]__[local]___[hash:base64:5]', importLoaders: 1 } },
        ],
    },
    {
        test: /\.json$/,
        use: [
            { loader: 'json-loader' },
        ],
    },
    {
        test: /\.(png|jpg|gif)$/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: '10000',
                name:  '[path][name].[ext]'
            }
        }]
    },
    {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: '10000',
                mimetype: 'image/svg+xml',
                name: '[path][name].[ext]'
            }
        }],
    }
];
