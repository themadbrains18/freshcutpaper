const babelOptions = {
  plugins: ['@babel/syntax-dynamic-import', '@babel/transform-runtime'],
  presets: ['@babel/env'],
};

module.exports = require('babel-jest').createTransformer(babelOptions);
