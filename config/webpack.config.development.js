const path = require('path')
const webpack = require('webpack')
const ESLintPlugin = require('eslint-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const DayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')

const rules = require('./webpack.rules')
module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'main.js'
  },
  target: 'electron-renderer',
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    modules: ['node_modules', 'src'],
    alias: {
      '@constants': resolve('constants'),
      '@utils': resolve('utils'),
      '@components': resolve('components'),
      '@decorators': resolve('decorators'),
    }
  },
  module: {
    rules: rules.concat([
      {
        test: /\.(js|ts)x?$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
              },
            }
          }
        ]
      },
      {
        test: /\.less$/,
        exclude: /(node_modules|antd)/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]'
              },
            }
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                relativeUrls: false,
                math: 'always',
                javascriptEnabled: true
              }
            }
          }
        ]
      },
      {
        test: /antd\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ]
      }
    ])
  },
  plugins: [
    new ESLintPlugin({
      context: path.resolve(__dirname, '..'),
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      failOnError: true,
    }),
    new ReactRefreshWebpackPlugin(),
    new DayjsWebpackPlugin(),
    new webpack.ProvidePlugin({
      'React': 'react'
    }),
    new webpack.DefinePlugin({
      API_SERVER_PLACEHOLDER: JSON.stringify('')
    })
  ],
  devServer: {
    static: [
      {
        directory: path.join(__dirname, '..'),
      },
      {
        directory: path.join(__dirname, '../dist'),
      }
    ],
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    hot: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    allowedHosts: 'all',
    proxy: {
      '/dev': {
        target: '',
        pathRewrite: { '^/dev': '' },
      },
    }
  }
}

function resolve(p) {
  return path.join(__dirname, '../src', p)
}
