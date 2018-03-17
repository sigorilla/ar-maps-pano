const path = require('path');
const webpack = require('webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const ENTRY_POINTS = [
    'index',
    'chess'
];

const JS_LOADERS = [
    'babel-loader?cacheDirectory'
];

const PLUGINS = [];
if (IS_PRODUCTION && process.env.MKT_ENV !== 'dev') {
    // Uglify in production, but not -dev.
    PLUGINS.push(
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                except: ['$super', '$', 'exports', 'require']
            }
        })
    );
    PLUGINS.push(
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        })
    );
} else {
    PLUGINS.push(
        new BrowserSyncPlugin({
            host: '0.0.0.0',
            port: '4200',
            server: {
                baseDir: ['public', 'build']
            }
        })
    );
    PLUGINS.push(
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"'
        })
    );
}

module.exports = {
    entry: ENTRY_POINTS.reduce(
        (result, name) => ({...result, [name]: path.join(__dirname, './src/app/', name + '.js')}),
        {}
    ),
    output: {
        // Bundle will be served at /bundle.js locally.
        filename: '[name].js',
        // Bundle will be built at ./src/media/js.
        path: path.join(__dirname, './build'),
        publicPath: '/'
    },
    module: {
        rules: [
            {
                exclude: /(node_modules|bower_components|vr-markup)/,
                loaders: JS_LOADERS,
                test: /\.js$/
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    plugins: PLUGINS,
    resolve: {
        extensions: ['.js', '.json'],
        modules: [
            'src',
            'node_modules'
        ]
    }
};
