let {optimize}=require('webpack');

module.exports = {
    entry: {
        app: ['./src/app.js'],
        cats: ['./src/cats.js']
    },
    output: {
        path: './dist',
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
            {test: /\.css$/, loader: 'style!css'}
        ]
    },
    plugins: []
};

