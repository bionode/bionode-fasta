var webpack = require('webpack')
module.exports = {
  context: __dirname,
  entry: './build-browser.js',
  output: {
    filename: './bionodeFasta.min.js'
  },
  plugins: [new webpack.optimize.UglifyJsPlugin()]
}
