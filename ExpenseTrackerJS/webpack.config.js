/* eslint no-console: 'off'*/

// first commit in dev2. modifying it..
// second commt.
// regr changes..
// regr 2 changes...
// regr 3 changes...

const path = require('path');
const webpack = require('webpack');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    // wp_angular: ['jQuery', 'lodash', 'angular'],
    // wp_angularAll: ['angular-route', 'angular-resource', 'angular-animate', 'angular-chart', 'angular-bootstrap'],
    // wp_others: ['chart.js', 'bootstrap', 'bootstrap-datepicker', 'less', 'moment'],
    wp_main: './webpack.input.js'
  },
  output: {
    // filename: '[name].[chunkhash].js',
    filename: '[name].js',
    path: path.resolve(__dirname, './public/dist2'),
    // sourceMapFilename: '[name].map'
  },
  // module: {
  //   rules: [{
  //     test: /\.css$/,
  //     use: ExtractTextPlugin.extract({
  //       use: 'css-loader'
  //     })
  //   }]
  // },
  plugins: [
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'angular', // specify the common bundle's name.
    //   minChunks: function (m) {
    //     console.log('Context = ' + m.context);
    //      // this assumes your vendor imports exist in the node_modules directory
    //     return m.context && m.context.indexOf('bower_components') !== -1 && m.context.indexOf('angular') !== -1;
    //   }}),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery',
      angular: 'angular',
      _: 'lodash',
      'chart.js': 'chart.js'
    }),
    new webpack.LoaderOptionsPlugin({
      // minimize: true,
      minimize: false,
      debug: false
    }),
    // new ExtractTextPlugin('styles.css'),
    // new webpack.optimize.UglifyJsPlugin({
    //   beautify: false,
    //   mangle: {
    //     screw_ie8: true,
    //     keep_fnames: true
    //   },
    //   compress: {
    //     screw_ie8: true
    //   },
    //   comments: false,
    //   // sourceMap: true
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor', // specify the common bundle's name.
    //   minChunks: function (m) {
    //        // this assumes your vendor imports exist in the node_modules directory
    //     return m.context && m.context.indexOf('node_modules') !== -1;
    //   }}),
      // commonChunksPlugin will now extract all the common modules from vendor and main bundles
    // new webpack.optimize.CommonsChunkPlugin({
    //   since there are no more common modules between them we end up with just the runtime code included in manifest
    //   name: 'manifest'
    // })
  ]
};