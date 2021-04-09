const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

module.exports = {

  mode: 'development',
  entry: {
    main: path.resolve(__dirname, './src/js/main.js'),
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: `./js/${filename('js')}`,
    publicPath: './',
    assetModuleFilename: 'assets/[hash][ext][query]',
  },

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    open: true,
    hot: true,
    compress: true,
    port: 3000,
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, './src/assets/'), to: path.resolve(__dirname, './dist/') },
        { from: path.resolve(__dirname, './src/img/'), to: path.resolve(__dirname, './dist/img/') },
      ],
    }),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: isProd,
      }
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `./styles/${filename('css')}`
    })
  ],

  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          sources: false,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
            }
          },
          'css-loader'],
      },
      // {
      //   test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
      //   type: 'asset/resource'
      // },
    ],
  }
}
