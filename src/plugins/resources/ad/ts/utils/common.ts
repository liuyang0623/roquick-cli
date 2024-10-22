export function getUID() {
  function getHash(str: string) {
    var hash = 1,
      charCode = 0,
      idx
    if (str) {
      hash = 0
      for (idx = str.length - 1; idx >= 0; idx--) {
        charCode = str.charCodeAt(idx)
        hash = ((hash << 6) & 268435455) + charCode + (charCode << 14)
        charCode = hash & 266338304
        hash = charCode != 0 ? hash ^ (charCode >> 21) : hash
      }
    }
    return hash
  }
  return ('' + getHash(document.referrer) + new Date().getTime() + getHash(document.cookie)).substr(0, 32)
}

export function getBrowser() {
  const sys = {} as any
  const ua = navigator.userAgent.toLowerCase()
  let s
  ;(s = ua.match(/edge\/([\d.]+)/))
    ? (sys.edge = s[1])
    : (s = ua.match(/rv:([\d.]+)\) like gecko/))
    ? (sys.ie = s[1])
    : (s = ua.match(/msie ([\d.]+)/))
    ? (sys.ie = s[1])
    : (s = ua.match(/firefox\/([\d.]+)/))
    ? (sys.firefox = s[1])
    : (s = ua.match(/chrome\/([\d.]+)/))
    ? (sys.chrome = s[1])
    : (s = ua.match(/opera.([\d.]+)/))
    ? (sys.opera = s[1])
    : (s = ua.match(/version\/([\d.]+).*safari/))
    ? (sys.safari = s[1])
    : 0
  if (sys.edge) return { browser: 'Edge', version: sys.edge }
  if (sys.ie) return { browser: 'IE', version: sys.ie }
  if (sys.firefox) return { browser: 'Firefox', version: sys.firefox }
  if (sys.chrome) return { browser: 'Chrome', version: sys.chrome }
  if (sys.opera) return { browser: 'Opera', version: sys.opera }
  if (sys.safari) return { browser: 'Safari', version: sys.safari }

  return { browser: '', version: '0' }
}

export function stringify(data: any) {
  const arr = []
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      arr.push(key + '=' + encodeURIComponent(data[key]))
    }
  }
  return arr.join('&')
}


