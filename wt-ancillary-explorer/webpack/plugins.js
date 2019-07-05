const { join } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const packageJson = require('../package');

const isProduction = process.env.NODE_ENV === 'production';

const targetRouter = process.env.HASH_ROUTED_BUILD ? 'hash-router' : 'connected-router';

// the clean options to use
const cleanOptions = {
  verbose: true,
  dry: false,
};

const plugins = [
  new webpack.EnvironmentPlugin(['NODE_ENV']),
  new CleanWebpackPlugin(cleanOptions),
  new webpack.NamedModulesPlugin(),
  new HtmlWebpackPlugin({
    template: join('src', 'index.html'),
    meta: {
      version: packageJson.version,
      'git-rev': process.env.GIT_REV,
    },
  }),
  new webpack.NormalModuleReplacementPlugin(
    /(.*)\.TARGET_ROUTER(\.*)/,
    ((resource) => {
      resource.request = resource.request
        .replace(/\.TARGET_ROUTER/, `.${targetRouter}`);
    }),
  ),
  new CopyWebpackPlugin(['src/env.js']),
];

if (isProduction) {
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new OptimizeCSSAssetsPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/),
    new MiniCssExtractPlugin({
      filename: 'css/[contenthash].css',
      chunkFilename: 'css/[contenthash].css',
    }),
  );
} else {
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      defaultSizes: 'parsed',
      openAnalyzer: false,
    }),
    new webpack.HotModuleReplacementPlugin(),
  );
}


module.exports = plugins;
