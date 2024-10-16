import { resolve, sep } from 'path'
import { copySync, removeSync } from 'fs-extra'
import { updateJSONFile } from './updateJSONFile'
import { TemplateType } from '../enums/TemplateType'
import { resolveResource, getProjectName } from './common'

/**
 * 一些初始化操作，修改项目名
 * @param projectDir
 * @param type
 */
export function initProject(projectDir: string, type: TemplateType) {
  removeSync(projectDir)
  const templateDir =
    type === TemplateType.JavaScript
      ? 'javascript'
      : type === TemplateType.TypeScript
      ? 'typescript'
      : type === TemplateType.JSX
      ? 'jsx'
      : type === TemplateType.TSX
      ? 'tsx'
      : 'javascript'
  copySync(resolveResource(`./templates/${templateDir}`), projectDir)
  updateJSONFile(resolve(projectDir, 'package.json'), (json) => {
    const oldName = json.name
    json.name = getProjectName(projectDir)
    json.main = json.main.replace(oldName, json.name)
    json.module = json.module.replace(oldName, json.name)
  })
}
