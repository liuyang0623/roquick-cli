import { Command } from "commander"
import Inquirer from "inquirer"
import { resolve } from "path"
import { pathExistsSync } from "fs-extra"
import { TemplateType } from "./enums/TemplateType"
import appInfo from "../package.json"
import { execReady } from "./helpers/exec"
import { JSPlugin, TSPlugin, JSXPlugin, TSXPlugin, CSSPlugin } from './plugins/base/constant'
import { BasePlugin } from "./plugins/base/BasePlugin"
import { canBeConvertedToNumber } from "./helpers/common"
import { BabelPlugin } from './plugins/babel'
import { PrettierPlugin } from './plugins/prettier'
import { QCdnPlugin } from "./plugins/qCdn"
import { StylePlugin } from "./plugins/style"
import { DevServerPlugin } from "./plugins/devServer"
import { initProject } from "./helpers/initProject"

const program = new Command()

/**
 * 询问模板类型
 */
async function promptTemplateType(): Promise<TemplateType> {
  const { type } = await Inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: '请选择需要的模板',
      default: TemplateType.JavaScript as TemplateType,
      choices: Object.values(TemplateType).map((name) => ({
        name,
        value: name as TemplateType,
        checked: name === TemplateType.JavaScript
      })),
    }
  ])
  return type 
}

/**
 * 询问安装插件选项
 */
async function promptInput(plugin: typeof JSPlugin | typeof TSPlugin | typeof JSXPlugin) {
  // @ts-ignore
  return Inquirer.prompt([
    {
      type: 'checkbox',
      name: 'options',
      message: '请选择需要的组件',
      suffix: '请按下空格',
      choices:  [...Object.keys(plugin)]
        .filter(k => !canBeConvertedToNumber(k))
        .map((k, i) => ({
          name: k,
          value: plugin[k as keyof typeof plugin],
          checked: i === 0,
        })),
    }
  ])
}

/**
 * 询问css预处理器
 */
async function promptStyle(): Promise<CSSPlugin> {
  const { style } = await Inquirer.prompt([
    {
      type: 'list',
      name: 'style',
      message: '请选择需要的模板',
      default: CSSPlugin.None as CSSPlugin,
      choices: Object.values(CSSPlugin).map((name) => ({
        name,
        value: name as CSSPlugin,
        checked: name === CSSPlugin.None
      })),
    }
  ])
  return style 
}

/**
 * 创建JavaScript项目
 */
async function createJavaScriptProject(projectDir: string) {
  const setting = await promptInput(JSPlugin)
  if (!setting) return false

  let needQnpm = false
  const options: JSPlugin[] = setting.options
  const plugins: BasePlugin[] = []
  if (options.includes(JSPlugin.Babel)) {
    const plugin = new BabelPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }
  if (options.includes(JSPlugin.Prettier)) {
    const plugin = new PrettierPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }
  if (options.includes(JSPlugin.QCdn)) {
    needQnpm = true
    const plugin = new QCdnPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }

  // 初始化项目
  initProject(projectDir, TemplateType.JavaScript)

  const pluginIdList = plugins.map((plugin) => plugin.id)

  plugins
    .map((plugin) => {
      plugin.plugins = pluginIdList
      plugin.type = TemplateType.JavaScript
      plugin.handle()
      return plugin
    })
    .forEach((plugin) => plugin.integrated())
  
  return needQnpm
}

/**
 * 创建jsx项目
 * @param projectDir 
 * @returns 
 */
async function createJSXProject(projectDir: string) {
  const setting = await promptInput(JSXPlugin)
  if (!setting) return false

  let needQnpm = false
  const options: JSXPlugin[] = setting.options
  const plugins: BasePlugin[] = []
  if (options.includes(JSXPlugin.Prettier)) {
    const plugin = new PrettierPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }
  if (options.includes(JSXPlugin.QCdn)) {
    needQnpm = true
    const plugin = new QCdnPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }
  if (options.includes(JSXPlugin.devServer)) {
    const plugin = new DevServerPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }

  // css预处理器
  const cssPlugin = await promptStyle()
  if ([CSSPlugin.Sass, CSSPlugin.Less].includes(cssPlugin)) {
    const plugin = new StylePlugin(cssPlugin, 'jsx')
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }

  // 初始化项目
  initProject(projectDir, TemplateType.JSX)

  const pluginIdList = plugins.map((plugin) => plugin.id)

  plugins
    .map((plugin) => {
      plugin.plugins = pluginIdList
      plugin.type = TemplateType.JavaScript
      plugin.handle()
      return plugin
    })
    .forEach((plugin) => plugin.integrated())
  
  return needQnpm
}

/**
 * 创建TypeScript项目
 */
async function createTypeScriptProject(projectDir: string) {
  const setting = await promptInput(TSPlugin)
  if (!setting) return false

  let needQnpm = false
  const options: TSPlugin[] = setting.options
  const plugins: BasePlugin[] = []
  if (options.includes(TSPlugin.Prettier)) {
    const plugin = new PrettierPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }
  if (options.includes(TSPlugin.QCdn)) {
    needQnpm = true
    const plugin = new QCdnPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }

  // 初始化项目
  initProject(projectDir, TemplateType.TypeScript)

  const pluginIdList = plugins.map((plugin) => plugin.id)

  plugins
    .map((plugin) => {
      plugin.plugins = pluginIdList
      plugin.type = TemplateType.TypeScript
      plugin.handle()
      return plugin
    })
    .forEach((plugin) => plugin.integrated())
  
  return needQnpm
}

/**
 * 创建tsx项目
 * @param projectDir 
 * @returns 
 */
async function createTSXProject(projectDir: string) {
  const setting = await promptInput(TSPlugin)
  if (!setting) return false

  let needQnpm = false
  const options: TSXPlugin[] = setting.options
  const plugins: BasePlugin[] = []
  if (options.includes(TSXPlugin.Prettier)) {
    const plugin = new PrettierPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }
  if (options.includes(TSXPlugin.QCdn)) {
    needQnpm = true
    const plugin = new QCdnPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }
  if (options.includes(TSXPlugin.devServer)) {
    const plugin = new DevServerPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }


  // css预处理器
  const cssPlugin = await promptStyle()
  if ([CSSPlugin.Sass, CSSPlugin.Less].includes(cssPlugin)) {
    const plugin = new StylePlugin(cssPlugin, 'tsx')
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }

  // 初始化项目
  initProject(projectDir, TemplateType.TSX)

  const pluginIdList = plugins.map((plugin) => plugin.id)

  plugins
    .map((plugin) => {
      plugin.plugins = pluginIdList
      plugin.type = TemplateType.TypeScript
      plugin.handle()
      return plugin
    })
    .forEach((plugin) => plugin.integrated())
  
  return needQnpm
}

/**
 * 运行主方法，选择创建项目不同类型
 */
program
  .option("-d, --debug", "输出内部调试信息")
  .version(appInfo.version, '-v, --version', `qihoo-sdk-cli ${appInfo.version}`)
  .command('create <project-name>')
  .action(async (projectPath: string) => {
    const projectDir = resolve(process.cwd(), projectPath)
    if (pathExistsSync(projectDir)) {
      const { isCovering } = await Inquirer.prompt([
        {
          type: 'confirm',
          name: 'isCovering',
          message: '文件夹已存在，是否确认覆盖',
          default: false
        }
      ])
      if (!isCovering) {
        console.log("已取消")
        return
      }
    }
    const type = await promptTemplateType()
    let needQnpm = false
    switch (type) {
      case TemplateType.JavaScript:
        needQnpm = await createJavaScriptProject(projectDir);
        break;
      case TemplateType.TypeScript:
        needQnpm = await createTypeScriptProject(projectDir);
        break;
      case TemplateType.JSX:
        needQnpm = await createJSXProject(projectDir);
        break;
      case TemplateType.TSX:
        needQnpm = await createTSXProject(projectDir);
        break;
      default:
        needQnpm = await createJavaScriptProject(projectDir);
        break;
    }
    // 做最后的准备工作
    execReady(projectDir, needQnpm)
  })

/**
 * 解析命令
 */
program.parse(process.argv)

