const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');

// const isDev = process.env.NODE_ENV === 'development';

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  assets: 'assets/',
};

// Pages const for HtmlWebpackPlugin
// see more: https://github.com/vedees/webpack-template/blob/master/README.md#html-dir-folder
// const PAGES_DIR = PATHS.src;
// const PAGES_DIR = `${PATHS.src}/html`;
const PAGES_DIR = `${PATHS.src}/pug/pages/`;
// const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.html'));
const PAGES = fs.readdirSync(PAGES_DIR).filter((fileName) => fileName.endsWith('.pug'));

module.exports = {

  externals: {
    paths: PATHS,
  },

  entry: {
    app: PATHS.src,
    landingpage: `${PATHS.src}/js/landingpage.js`,
    colorstype: `${PATHS.src}/js/colorstype.js`,
    headersfooters: `${PATHS.src}/js/headersfooters.js`,
    // lk: `${PATHS.src}/lk.js`,
    formelements: `${PATHS.src}/js/formelements.js`,
  },
  output: {
    filename: `${PATHS.assets}js/[name].[hash].js`,
    path: PATHS.dist,
    publicPath: '/',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true,

        },
      },
    },
  },
  module: {
    rules: [{
      test: /\.pug$/,
      loader: 'pug-loader',
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: '/node_modules/',
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        scss: 'vue-style-loader!css-loader!sass-loader',
      },
    }, {
      test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
      },
    }, {
      test: /\.(png|jpe?g|gif|svg)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
      },
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: { sourceMap: true },
        }, {
          loader: 'postcss-loader',
          options: { sourceMap: true },
        }, {
          loader: 'sass-loader',
          options: { sourceMap: true },
        },
      ],
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: { sourceMap: true },
        }, {
          loader: 'postcss-loader',
          options: { sourceMap: true },
        },
      ],
    }],
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '~': 'src',
      vue$: 'vue/dist/vue.js',
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    }),
    new VueLoaderPlugin(),
    // new MiniCssExtractPlugin({
    // filename: `${PATHS.assets}css/[name].[contenthash].css`,
    // }),
    new MiniCssExtractPlugin({
      // filename: `${PATHS.assets}css/[name].[contenthash].css`,
      filename: '[name]/[name].[contenthash].css',
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano,
      cssProcessorPluginOptions: {
        preset: ['default'],
      },
      canPrint: true,
    }), // подключите плагин после MiniCssExtractPlugin
    // new HtmlWebpackPlugin({
    // template: `${PATHS.src}/html/index.html`,
    // filename: './index.html',
    // title: 'Webpack Template',
    // // favicon: 'string',
    // inject: false
    // }),
    new CopyWebpackPlugin([
      { from: `${PATHS.src}/${PATHS.assets}img`, to: `${PATHS.assets}img` },
      { from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts` },
      { from: `${PATHS.src}/static`, to: '' },
    ]),
    // Automatic creation any html pages (Don't forget to RERUN dev server)
    // ...PAGES.map(page => new HtmlWebpackPlugin({
    // template: `${PAGES_DIR}/${page}`, // .pug
    // filename: `./${page}` // .html
    // }))
    // Automatic creation any pug pages (Don't forget to RERUN dev server)
    ...PAGES.map((page) => new HtmlWebpackPlugin({
      template: `${PAGES_DIR}/${page}`, // .pug
      filename: `./${page.replace(/\.pug/, '.html')}`, // .html
      // filename: `./${page.replace(/\.pug/, '')}/${page.replace(/\.pug/, '.html')}`, // .html
    })),
    new WebpackMd5Hash(),
  ],
};
