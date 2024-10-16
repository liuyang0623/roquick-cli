import { resolve } from 'path'
import { updateJSONFile } from '../helpers/updateJSONFile'
import pkgJSON from './resources/qCdn/package.json'
import { copySync } from 'fs-extra'
import { BasePlugin } from './base/BasePlugin'
import { JSPlugin } from './base/constant'
import merge from 'deepmerge'

export class QCdnPlugin extends BasePlugin {
  private qCdnDemoName = 'qcdn.demo.js'

  constructor() {
    super(JSPlugin.QCdn)
  }

  handle(): void {
    //更新 package.json
    updateJSONFile(resolve(this.projectDir, 'package.json'), (json) =>
      merge(json, pkgJSON),
    )
    //拷贝配置文件
    copySync(
      resolve(__dirname, 'resources/qCdn', this.qCdnDemoName),
      resolve(this.projectDir, this.qCdnDemoName),
    )
  }
}
