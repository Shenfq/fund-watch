import { window, EventEmitter, Event, TreeDataProvider, TreeItem } from 'vscode'
import { fundApi } from '../utils'
import fundHandle from './Handle'
// eslint-disable-next-line no-unused-vars
import FundItem from './TreeItem'

export default class DataProvider implements TreeDataProvider<FundItem> {
  public refreshEvent: EventEmitter<FundItem | null> = new EventEmitter<FundItem | null>()

  readonly onDidChangeTreeData: Event<FundItem | null> = this.refreshEvent.event

  private order: number

  constructor() {
    this.order = -1
  }

  refresh() {
    setTimeout(() => {
      this.refreshEvent.fire(null)
    }, 200)
  }

  // eslint-disable-next-line class-methods-use-this
  getTreeItem(element: FundItem): TreeItem {
    return element
  }

  getChildren(): Promise<FundItem[]> {
    return fundHandle.getFavorites(this.order)
  }

  changeOrder(): void {
    this.order *= -1
    this.refresh()
  }

  async addFund() {
    const res = await window.showInputBox({
      value: '',
      valueSelection: [5, -1],
      prompt: '添加基金到自选',
      placeHolder: 'Add Fund To Favorite',
      validateInput: (inputCode: string) => {
        const codeArray = inputCode.split(/[\W]/)
        const hasError = codeArray.some((code) => {
          return code !== '' && !/^\d+$/.test(code)
        })
        return hasError ? '基金代码输入有误' : null
      },
    })
    if (res !== undefined) {
      const codeArray = res.split(/[\W]/) || []
      const newFunds: string[] = [...codeArray]
      const result = await fundApi(newFunds)
      if (result && result.length > 0) {
        result.forEach((fundInfo) => {
          if (fundInfo) {
            fundHandle.updateConfig(newFunds)
            this.refresh()
          }
        })
      } else {
        window.showWarningMessage('stocks not found')
      }
    }
  }
}
