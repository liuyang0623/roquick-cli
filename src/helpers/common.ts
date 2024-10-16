import { resolve, sep } from 'path'

export function canBeConvertedToNumber(value: any): boolean {
  return !isNaN(value) && value !== null;
}

export function resolveResource(...paths: string[]): string {
  return resolve(__dirname, ...paths)
}

export function getProjectName(projectDir: string): string {
  const projectPathList = projectDir.split(sep)
  return projectPathList[projectPathList.length - 1]
}
