import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import html from 'rollup-plugin-html';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import json from 'rollup-plugin-json';
import pkg from './package.json';
import css from "rollup-plugin-import-css";
import scss from "rollup-plugin-scss";

const babel = require('rollup-plugin-babel');

module.exports = {
  input: 'src/run.ts',
  output: [
    { file: pkg.browser, format: 'umd' },
  ],
  plugins: [
    css(),
    terser(),
    typescript(),
    resolve(),
    babel({
      babelrc: false,
      runtimeHelpers: true,
      exclude: 'node_modules/**',
    }),
    commonjs({
      namedExports: {},
    }),
    html({
      include: '**/*.html',
    }),
    postcss({
      extensions: ['.scss'],
      minimize: true,
      extract: `dist/${pkg.name}.min.css`,
    }),
    copy({
      targets: [
        { src: 'src/assets/images/**/*', dest: 'dist/images' },
      ],
    }),
    json({
      include: 'node_modules/**',
      preferConst: true,
    }),
  ],
};
