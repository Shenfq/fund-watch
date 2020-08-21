import { TreeItem } from 'vscode'
import { fillString, FundInfo } from '../utils'

export default class FundItem extends TreeItem {
  info: FundInfo

  constructor(info: FundInfo) {
    const icon = Number(info.changeRate) >= 0 ? '📈' : '📉'
    const prev = Number(info.changeRate) >= 0 ? '+' : '-'
    const rage = `${prev}${info.changeRate}%`
    const name = fillString(info.name, 25)

    super(`${icon}${name} ${rage}`)

    let sliceName = info.name
    if (sliceName.length > 8) {
      sliceName = `${sliceName.slice(0, 8)}...`
    }
    const tips = [
      `代码:　${info.code}`,
      `名称:　${sliceName}`,
      `--------------------------`,
      `单位净值:　　　　${info.now}`,
      `涨跌幅:　　　　　${info.changeRate}%`,
      `涨跌额:　　　　　${info.changeAmount}`,
      `昨收:　　　　　　${info.lastClose}`,
    ]

    this.info = info
    this.tooltip = tips.join('\r\n')
  }
}
