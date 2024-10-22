import { resolve } from 'path'
import { updateJSONFile } from '../helpers/updateJSONFile'
import pkgJSON from './resources/ad/package.json'
import { copySync } from 'fs-extra'
import { BasePlugin } from './base/BasePlugin'
import { JSPlugin } from './base/constant'
import merge from 'deepmerge'

export class AdPlugin extends BasePlugin {
  private tplType: string = "js"
  constructor(type: string) {
    super(JSPlugin.AdFetch)
    this.tplType = type
  }

  handle(): void {
    //更新 package.json
    updateJSONFile(resolve(this.projectDir, 'package.json'), (json) =>
      merge(json, pkgJSON),
    )

    // 复制文件
    const adTplPath = this.tplType.indexOf("ts") !== -1 ? "ts" : "js"
    copySync(resolve(__dirname, `resources/ad/${adTplPath}/`), resolve(this.projectDir, 'src/'))
  }
}
