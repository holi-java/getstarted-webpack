let {optimize}=require('webpack');

module.exports = {
    context: __dirname + '/src',
    entry: {
        app: ['./app.js'],
        cats: ['./cats.js']
    },
    output: {
        path: './dist',
        filename: '[name].bundle.js',
        pathinfo: true
    },
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
            {test: /\.css$/, loader: 'style!css'}
        ]
    },
    plugins: []
};

