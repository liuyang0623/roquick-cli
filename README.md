# 帮助Rollup sdk项目快速生成的脚手架

> 正在逐步完善中

[![npm](https://img.shields.io/npm/v/ro-quick.svg?color=red&label=npm)](https://www.npmjs.com/package/ro-quick) [![doc](https://img.shields.io/badge/document-98%25-brightgreen.svg)](https://github.com/liuyang0623/roquick-cli) [![license-MIT-blue](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 简介

帮助开发者快速创建新的rollup sdk，减少配置时间，减少重复逻辑书写时间

## 功能列表

- [x] 模板选择：js、ts、jsx、tsx（模板语法使用preact）
- [x] 插件支持
  - [x] Prettier
  - [x] devServer
  - [x] sass/less
  - [x] qcdn(需要qnpm环境)

## 暂未实现功能
- [ ] 广告请求预设
- [ ] 打点预设
- [ ] 客户端方法预设
- [ ] ...

## 许可证

[MIT](./LICENSE)

## 使用方法

```sh
# 全局安装
npm i -g ro-quick
# 命令示例
# 版本
ro-quick -v
# 创建项目
ro-quick create example
```