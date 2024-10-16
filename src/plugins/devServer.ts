import { resolve } from 'path'
import { BabelFileResult, parseSync, transformFromAstSync } from '@babel/core'
import {
  Expression,
  File,
  isImportDeclaration,
  isExportDefaultDeclaration,
  ExportDefaultDeclaration,
  ObjectExpression,
  isObjectProperty,
  Identifier,
  ArrayExpression,
  ObjectProperty,
} from '@babel/types'
import { parseExpression } from '@babel/parser'
import { findLastIndex } from 'lodash'
import { updateJSONFile } from '../helpers/updateJSONFile'
import { getProjectName } from '../helpers/common'
import pkgJSON from './resources/devServer/package.json'
import { copySync, readFileSync, writeFileSync } from 'fs-extra'
import { BasePlugin } from './base/BasePlugin'
import { JSPlugin } from './base/constant'
import merge from 'deepmerge'

export class DevServerPlugin extends BasePlugin {
  constructor() {
    super(JSPlugin.devServer)
  }

  handle(): void {
    //更新 package.json
    updateJSONFile(resolve(this.projectDir, 'package.json'), (json) =>
      merge(json, pkgJSON),
    )

    // 更新测试html内容
    const projectName = getProjectName(this.projectDir)
    const testHtmlPath = resolve(__dirname, './resources/devServer/tpl/index.html')
    const testHtmlStr = readFileSync(testHtmlPath, {
      encoding: 'utf8'
    })
    const scriptStr = `
      <script src="../dist/${projectName}.min.js"></script>
      <script>
        ${projectName.toLocaleUpperCase()}()
      </script>
    `
    const replaceHtmlStr = testHtmlStr.replace('<--DEMO_TITLE-->', 'test').replace('<--INJECT_SCRIPT-->', scriptStr)
    writeFileSync(resolve(__dirname, './resources/devServer/test/index.html'), replaceHtmlStr, { encoding: 'utf8' })
    copySync(resolve(__dirname, './resources/devServer/test/'), resolve(this.projectDir, 'test'))

    // 配置devServer
    const devPluginImport = (parseSync(
      "import dev from 'rollup-plugin-dev'",
    ) as File).program.body[0]
    const livereloadPluginImport = (parseSync(
      "import livereload from 'rollup-plugin-livereload'",
    ) as File).program.body[0]
    const devPluginConfig: Expression = parseExpression(`
      env === 'development' &&
      dev({
        port: 8888,
        dirs: ['./'],
      })
    `)
    const livereloadPluginConfig: Expression = parseExpression(`
      env === 'development' &&
        livereload("dist")
    `)
    const rollupConfigPath = resolve(
      this.projectDir,
      'rollup.config.js',
    )
    const str = readFileSync(rollupConfigPath, {
      encoding: 'utf8',
    })
   
    const ast = parseSync(str) as File
    // 找到最后一个 import 的位置，没有找到则放置到 0
    const index =
      findLastIndex(ast.program.body, (node) => isImportDeclaration(node)) + 1
    // 添加 import
    ast.program.body = [
      ...ast.program.body.slice(0, index),
      devPluginImport,
      livereloadPluginImport,
      ...ast.program.body.slice(index),
    ]
    // 修改默认导出的值
    const exportDefaultNode = ast.program.body.find((node) =>
      isExportDefaultDeclaration(node),
    ) as ExportDefaultDeclaration
    const plugins = ((exportDefaultNode.declaration as ObjectExpression).properties.find(
      (node) =>
        isObjectProperty(node) && (node.key as Identifier).name === 'plugins',
    ) as ObjectProperty).value as ArrayExpression
    plugins.elements.push(devPluginConfig)
    plugins.elements.push(livereloadPluginConfig)

    writeFileSync(
      rollupConfigPath,
      // @ts-ignore
      (transformFromAstSync(ast) as BabelFileResult).code,
      {
        encoding: 'utf8',
      },
    )
  }
}
