import { name } from './package.json'
import { resolve } from 'path'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const env = process.env.NODE_ENV;
export default {
  // 入口文件
  input: resolve(__dirname, './src/index.ts'),
  output: {
    // 打包名称
    name: name.toLocaleUpperCase(),
    format: 'iife',
    file: resolve(__dirname, `dist/${name}.min.js`),
  },
  plugins: [
    json(),
    nodeResolve(),
    commonjs(),
    typescript({
      exclude: ['./dist', './src/**/*.test.ts'],
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
