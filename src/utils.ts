import * as https from 'https'
import * as stringWidth from 'string-width'

export interface FundInfo {
  now: string
  name: string
  code: string
  lastClose: string
  changeRate: string
  changeAmount: string
}

// 请求
const request = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks: Buffer[] = []
      if (!res || res.statusCode !== 200) {
        reject(new Error('网络请求错误!'))
        return
      }
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', () => {
        let encode = 'utf8'
        const buff: Buffer = Buffer.concat(chunks)
        const contentType: void | String = res.headers['content-type']
        if (contentType) {
          const matchCharset = contentType.match(/(?:charset=)(\w+)/)
          encode = matchCharset ? matchCharset[1] : 'utf8'
        }
        // buffer to string
        const body = buff.toString(encode)
        resolve(body)
      })
    })
  })
}

export function fundApi(fundConfig: string[]): Promise<FundInfo[]> {
  const time = Date.now()
  const promises: Promise<string>[] = []

  fundConfig.forEach((code) => {
    const url = `https://fundgz.1234567.com.cn/js/${code}.js?rt=${time}`
    promises.push(request(url))
  })
  return Promise.all(promises).then((results) => {
    const resultArr: FundInfo[] = []
    results.forEach((rsp: string) => {
      const match = rsp.match(/jsonpgz\((.+)\)/)
      if (!match || !match[1]) {
        return
      }
      const str = match[1]
      const obj = JSON.parse(str)
      const info: FundInfo = {
        now: obj.gsz,
        name: obj.name,
        code: obj.fundcode,
        lastClose: obj.dwjz,
        changeRate: obj.gszzl,
        changeAmount: (obj.gsz - obj.dwjz).toFixed(4),
      }
      resultArr.push(info)
    })
    return resultArr
  })
}

/**
 * 字符串长度拼接
 * @param source 原字符串长度
 * @param length 修改后的字符串长度
 * @param left 原字符串是否靠左边
 */
export function fillString(
  source: string,
  length: number,
  left = true
): string {
  let rest = source
  while (stringWidth(rest) >= length) {
    rest = rest.slice(0, rest.length - 1)
  }
  const addString = '  '.repeat(length - stringWidth(rest))
  return left ? `${rest}${addString}` : `${addString}${rest}`
}

export function unique(arr: any[]) {
  return Array.from(new Set(arr))
}
