import path from 'path';
import { optimize, NoErrorsPlugin, DefinePlugin } from 'webpack';
import autoprefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const inDevMode = ( process.env.WEBPACK_ENV == 'development' );

const scssLoaders = () => {
	if ( inDevMode ) {
		return 'style-loader!css-loader!postcss-loader!sass?config=otherSassLoaderConfig';
	}
	return ExtractTextPlugin.extract( 'style-loader', 'css-loader!postcss-loader!sass-loader?config=otherSassLoaderConfig' );
};

const prodPlugins = inDevMode ? [] : [
	new optimize.DedupePlugin(),
	new ExtractTextPlugin( '../style.css' ),
	new DefinePlugin({
	  'process.env': {
	     NODE_ENV: JSON.stringify( 'production' )
	   }
	}),
	new optimize.UglifyJsPlugin(),
	new optimize.AggressiveMergingPlugin(),
	new NoErrorsPlugin()
];

const config = {
	devtool: inDevMode ? 'eval-source-map' : null,
  entry: [
		'babel-regenerator-runtime', // for ES7 @Decorators and Async-Await. runtime shim essentially.

		'./src/js/index',
		'./src/scss/style'
	],
	output: {
		filename: 'app.bundle.js',
		path: './js',
		publicPath: 'js'
	},
  module: {
		preLoaders: [{
			test: /\.js|\.jsx$/,
			exclude: /node_modules/,
			loader: 'eslint'
		}],
    loaders: [{
			test: /\.js|\.jsx$/,
			exclude: /node_modules/,
			loader: 'react-hot'
		}, {
			test: /\.js|\.jsx$/,
			exclude: /node_modules/,
			loader: 'babel',
			query: {
				cacheDirectory: true,
        plugins: [ 'transform-decorators-legacy', 'syntax-async-functions', 'transform-async-to-generator' ],
        presets: [ 'es2015', 'stage-0', 'react' ]
			}
		}, {
			test: /\.scss$/,
			loader: scssLoaders()
		}]
  },
  plugins: [
		new optimize.OccurenceOrderPlugin(),
		...prodPlugins
	],
	otherSassLoaderConfig: {
		outputStyle: inDevMode ? 'compressed' : 'expanded',
		sourceMapEmbed: inDevMode,
		sourceComments: inDevMode
  },
  postcss: [
    autoprefixer({
      browsers: ['last 2 versions']
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss'],
    root: [ path.resolve( `${process.cwd()}/src` ) ]
  }
};

export default config;
