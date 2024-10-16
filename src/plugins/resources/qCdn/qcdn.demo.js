import qcdn from "@q/qcdn"

/**
 * qcdn配置选项
 * 详细配置见文档：https://coding.qihoo.net/qnpm/package/%40q%2Fqcdn
 */
const options = {
  static: {
    https: true,
    domains: ['s1.ssl.qhimg.com', 's2.ssl.qhimg.com', 's3.ssl.qhimg.com', 's4.ssl.qhimg.com'],
  },
}
// 本地文件路径
const filePath = "<-FILE_PATH->"
async function uploadFileByQCdn() {
  try {
    const res = await qcdn.upload(filePath, options)
    const remoteUrl = res[Object.keys(res)[0]]
    console.log("上传成功，文件地址为：", remoteUrl)
  } catch (error) {
    console.log('上传文件出错', error)
  }
}