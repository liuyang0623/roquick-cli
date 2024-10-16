import { name } from './package.json'
import { resolve } from 'path'
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import alias from '@rollup/plugin-alias';

const env = process.env.NODE_ENV;
export default {
  // 入口文件
  input: resolve(__dirname, './src/index.jsx'),
  output: {
    // 打包名称
    name: name.toLocaleUpperCase(),
    format: 'iife',
    // 启用代码映射，便于调试之用
    file: resolve(__dirname, `dist/${name}.min.js`),
  },
  plugins: [
    json(),
    nodeResolve(),
    commonjs(),
    babel({
      babelHelpers: "bundled",
      extensions: [".js", ".jsx"],
      exclude: '../node_modules/**'
    }),
    alias({
      entries: [{
        find: "react",
        replacement: "preact/compat"
      }, {
        find: "react-dom/test-utils",
        replacement: "preact/test-utils"
      }, {
        find: "react-dom",
        replacement: "preact/compat"
      }, {
        find: "react/jsx-runtime",
        replacement: "preact/jsx-runtime"
      }]
    }),
    env === "production" &&  terser({
      output: {
        comments: false,
      },
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    }),
  ],
}
