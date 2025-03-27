const path = require('path');
const { library } = require('webpack');

const mode = process.env.NODE_ENV || 'production';

module.exports = {
  entry: {
    index: './src/index.ts'
  },
  mode,
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    library: {
      type: 'commonjs'
    }
  },
};