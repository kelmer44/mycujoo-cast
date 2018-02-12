module.exports = [
    {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
            { loader: 'babel-loader', options: { cacheDirectory: true } }
        ]
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
