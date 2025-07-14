const path = require('path');
const webpack = require('webpack');
module.exports = {
  entry: './src/DSIUtil.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify")
    },
    modules: ['.', 'node_modules'],
    extensions: ['.tsx', '.ts', '.js', '.d.js'],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
  ],
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, ''),
  },
  experiments: {
    outputModule: true
  },
  //mode: "development"
};