import { ExtensionContext, commands, window, workspace } from 'vscode'
import Provider from './data/Provider'
import fundHandle from './data/Handle'

// 激活插件
export function activate(context: ExtensionContext) {
  let interval = workspace.getConfiguration().get('fund-watch.interval', 2)
  if (interval < 2) {
    interval = 2
  }

  // 基金类
  const provider = new Provider()

  // 数据注册
  window.registerTreeDataProvider('fund-list', provider)

  // 定时任务
  setInterval(() => {
    provider.refresh()
  }, interval * 1000)

  // menu 事件
  context.subscriptions.push(
    commands.registerCommand(`fund.add`, () => {
      provider.addFund()
    }),
    commands.registerCommand(`fund.order`, () => {
      provider.changeOrder()
    }),
    commands.registerCommand(`fund.refresh`, () => {
      provider.refresh()
    }),
    commands.registerCommand('fund.item.remove', (fund) => {
      const { code } = fund
      fundHandle.removeConfig(code)
      provider.refresh()
    })
  )
}

export function deactivate() {}
