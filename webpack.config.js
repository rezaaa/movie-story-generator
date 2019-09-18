const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const currentDir = __dirname;
const codeBase = path.join(currentDir);
const PRODUCTION = process.env.NODE_ENV === 'production';

const plugins = [
  new HtmlWebpackPlugin({
  title: 'Production',
  template: './index.html'
  }),
  new CopyWebpackPlugin([
    { from: './favicon', to: './favicon' },
    { from: './CNAME', to: './' },
  ])
];

if (PRODUCTION) {
  plugins.push(new CleanWebpackPlugin(['public']));
}

const config = {
    entry: './index.js',
    devtool: 'eval',
    plugins: plugins,
    performance: { hints: false },
    output: {
        path: path.resolve(__dirname, 'public'),
        publicPath: PRODUCTION ? './' : '/',
        filename: 'bundle.js'
      },
      devServer: {
        contentBase: './public',
        inline: true,
        port: 3000,
        disableHostCheck: true
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ['babel-loader']
          },
          {
            test: /\.scss$/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2, // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
                  modules: true,
                  camelCase: 'dashes',
                  localIdentName: '[name]__[local]___[hash:base64:5]'
                }
              },
              'postcss-loader',
              'sass-loader',
            ]
          },
          {
            test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
            loaders: ['file-loader'],
            include: codeBase,
          },
          {
            test: /\.(png|jpg?)(\?[a-z0-9=&.]+)?$/,
            loaders: ['file-loader'],
            include: codeBase,
          },
        ],
      },
      resolve: {
        extensions: ['*', '.js', '.jsx']
      },
 }
 module.exports = config;