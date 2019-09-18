var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var config = require("./webpack.config");
const port = process.env.PORT || 3000;

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  disableHostCheck: true
}).listen(port, "0.0.0.0", function(err, result) {
  if (err) {
    console.log(err);
  }
});