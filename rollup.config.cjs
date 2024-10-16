const typescript = require('@rollup/plugin-typescript')
const json = require('@rollup/plugin-json')
const { resolve } = require('path')

module.exports = {
  // 入口文件
  input: resolve(__dirname, 'src/cli.ts'),
  output: {
    // 打包名称
    name: 'qli',
    // 文件顶部信息
    banner: '#!/usr/bin/env node',
    file: resolve(__dirname, 'bin/cli.js'),
    format: 'cjs'
  },
  plugins: [
    typescript({
      exclude: './src/templates/**'
    }),
    json({
      include: ['src/**', 'package.json'],
    }),
  ],
}
