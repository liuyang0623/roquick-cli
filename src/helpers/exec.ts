import shell from "shelljs"
import { formatPackageJSON } from './formatPackageJSON'

/**
 * 执行准备工作
 * @param projectDir
 */

export function execReady(projectDir: string, needQnpm: boolean) {
  formatPackageJSON(projectDir)
  // 进入目录安装依赖
  shell.cd(projectDir)
  if (needQnpm) {
    shell.exec('qnpm i && pnpm clean && pnpm build')
  } else {
    shell.exec('pnpm i && pnpm clean && pnpm build')
  }
}


