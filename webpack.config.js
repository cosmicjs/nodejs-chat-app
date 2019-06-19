require('dotenv').config();
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// var HtmlWebpackPlugin = require('html-webpack-plugin');

const dev = Boolean(process.env.NODE_ENV !== 'production');
let client_api_url = 'http://localhost:3000/api';
if (!dev) {
  client_api_url = `${process.env.__API_ORIGIN__}/api`;
}

module.exports = {
  entry: './src/app.js',
  mode: dev ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 5000
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin,
    // new HtmlWebpackPlugin({
    //   filename: 
    //   favicon: './public/favicon.ico',
    // }),
    new webpack.DefinePlugin({
      __API_URL__: JSON.stringify(client_api_url),
      __API_ORIGIN__: JSON.stringify(process.env.__API_ORIGIN__),
      __COSMIC_READ_KEY__: JSON.stringify(process.env.__COSMIC_READ_KEY__),
    })
  ],
  devServer: {
    contentBase: './dist',
    hot: true
  }
};
