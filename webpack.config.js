module.exports = {
    entry: "./src/app.js",
    output: {
        path: "./dist/js",
        publicPath: "/dist/js/",
        filename: "app.js"
    },
    externals: {
        'uglify-js': 'uglify-js'
    },
    target: 'electron',
    module: {
        resolve: {
            extensions: ['', '.js', '.vue', '.styl'],
        },
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },

            {
                test: /\.json$/,
                loader: 'json'
            },

            {
                test: /\.jsx?$/,
                // excluding some local linked packages.
                // for normal use cases only node_modules is needed.
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },

            {
                test: /\.styl$/,
                loader: "style!css!stylus"
            }
        ]
    }
}
