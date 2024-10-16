import sassPkgJSON from './resources/sass/package.json'
import lessPkgJSON from './resources/less/package.json'
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
import { BasePlugin } from './base/BasePlugin'
import { CSSPlugin } from './base/constant'
import { updateJSONFile } from '../helpers/updateJSONFile'
import { copySync, readFileSync, writeFileSync } from 'fs-extra'
import merge from 'deepmerge'

export class StylePlugin extends BasePlugin {
  private tplType: string = 'jsx'
  constructor(id: any, type: string) {
    super(id)
    this.tplType = type
  }
  handle(): void {
    const JSON_MAP = {
      Sass: sassPkgJSON,
      Less: lessPkgJSON
    }
    // @ts-ignore
    updateJSONFile(resolve(this.projectDir, 'package.json'), (json) => merge(json, JSON_MAP[this.id]))

    // 复制文件(css)
    const stylePath = this.id === CSSPlugin.Sass ? 'resources/sass' : 'resources/less'
    const styleFile = this.id === CSSPlugin.Sass ? 'index.scss' : 'index.less'
    copySync(resolve(__dirname, stylePath, styleFile), resolve(this.projectDir, 'src', styleFile))
    // 修改文件（ui）
    const tplPath = resolve(__dirname, stylePath, 'ui.tpl')
    const targetPath = resolve(this.projectDir, 'src', `index.${this.tplType}`)

    const importUiCode = this.tplType === 'jsx' ? `import React, { render } from 'react'` : `import { render } from 'preact'`
    const importStyleCode = `import './${styleFile}'`
    const resultUiFileStr = readFileSync(tplPath, { encoding: 'utf8',})
                            .replace('<--REACT_INJECT_CODE-->', importUiCode)
                            .replace('<--STYLE_INJECT_CODE-->', importStyleCode)
                            .replace('<-TPL_TYPE->', this.tplType)
    writeFileSync(
      targetPath,
      // @ts-ignore
      resultUiFileStr,
      {
        encoding: 'utf8',
      },
    )                        

    //修改 base dev 配置
    const postcssPluginImport = (parseSync(
      "import postcss from 'rollup-plugin-postcss'",
    ) as File).program.body[0]
    const autoprefixerPluginImport = (parseSync(
      "import autoprefixer from 'autoprefixer'",
    ) as File).program.body[0]
    const postcssPluginConfig: Expression = parseExpression(`
      postcss({
        plugins: [autoprefixer],
        extract: false,
        modules: true
      })
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
      postcssPluginImport,
      autoprefixerPluginImport,
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
    plugins.elements.push(postcssPluginConfig)

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
