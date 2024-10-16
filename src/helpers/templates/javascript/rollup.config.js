import { name } from './package.json'
import { format, resolve } from 'path'
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const env = process.env.NODE_ENV;
export default {
  // 入口文件
  input: resolve(__dirname, './src/index.js'),
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
