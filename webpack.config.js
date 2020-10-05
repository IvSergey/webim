// process.traceDeprecation = true;
// базовый модуль node.js  универсальный путь для разных платформ
const path = require ('path');



const webpack = require('webpack');
const HtmlWebpackPlugin = require ('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin'); 
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const PATHS = {
	// Исходники
    src: path.join(__dirname, 'src'),
    // Результат работы
    build: path.join(__dirname, 'build')
};
// Экспорт модулей js
module.exports = {
	// точка входа приложения
    entry: {
        'index': PATHS.src + '/page/index/index.js'
    },
    // Имена файлов и дирректория результата работы
    output: {
        path: PATHS.build,
        filename: './js/[name].js'
    },

    plugins: [
    	// Создание html файлов
        new HtmlWebpackPlugin({
            filename: 'index.html',
            chunks: ['index','section'],
            // Путь до шаблона
            template: PATHS.src + '/page/index/index.pug'
        }),
        // Для очистки папки build
        new CleanWebpackPlugin('build'),
        // Подключение отельных css файлов (когда не работает срабатывает fallback)
        new ExtractTextPlugin({
            filename: './css/[name].css'
        }),
          
        // автоматически выносит код из разных js и css файлов
        // new webpack.optimize.CommonsChunkPlugin({
        // 	name: 'common'
        // }),
        // Минимизация css
        new OptimizeCssAssetsPlugin({
        	//Удаляет все комментарии из CSS кода
            cssProcessorOptions: { discardComments: {removeAll: true } }
        }),
        // анализирует исходники и автоматически подключает нужные модули на основании используемых литералов
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery'
        }),
        new SpriteLoaderPlugin(),
        new UglifyJsWebpackPlugin()  // минификация js 
    ],
    module: {
        rules: [
            {
            	test: /\.pug$/, // регулярное выражение для работы с всеми файлами .pug
            	loader: 'pug-loader', // Для распознования webpack файлов .pug
            	options: {
            		pretty: true // Расстановка отступов
            	}
            },

            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                	publicPath: '../', // для того, чтобы пути к фоновым картинкам в css файле были правильными после сборки
          			use: ['css-loader','sass-loader']
              	})
            },

          	{
           		test: /\.css$/,
            	use: ExtractTextPlugin.extract({
              		fallback: 'style-loader',
              		use: ['css-loader']
            	})
          	},

          	{
                  test: /\.(jpg|png|svg|ico)$/,
                  loader: 'file-loader',
                  exclude: /sprite/,
          		  options: {
          			name: 'img/[name].[ext]',
          			pretty: true
          		},
            },
            
           
          	{
          		// Добавление префикса
                test: /\.js$/,
                enforce: 'pre',
                loader: 'eslint-loader',
                options: {
                    fix: true
                }            
            },

            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['babel-preset-env']
                }
              }
            },

            {
              test: /\.svg$/,
              exclude: [/icons/,/logo/],
              use: [
                {
                  loader: 'svg-sprite-loader',
                  options: {
                    extract: true,
                    spriteFilename: 'img/sprite/sprite.svg',
                  }
                },
                {
                  loader: 'svgo-loader',
                  options: {
                    plugins: [
                      { removeNonInheritableGroupAttrs: true },
                      { collapseGroups: true },
                      { removeAttrs: { attrs: '(fill|stroke)' } }
                    ],
                  },
                },
              ],
            },

            {
                test: /^(?!.*\.generated\.ttf$).*\.ttf$/,
                use: ExtractTextPlugin.extract({
                  publicPath: '../',
                  use: ['css-loader', 'fontface-loader']
                })
            },

            {
                test: /\.generated.(ttf|eot|woff|woff2)$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                      outputPath: 'fonts/',
                      name: '[name].[ext]'
                    }
                  }
                ]
            }
        ]
    }
}