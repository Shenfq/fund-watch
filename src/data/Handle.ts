import { workspace } from 'vscode'
import { fundApi, unique } from '../utils'
import FundItem from './TreeItem'

const fundHandle = {
  updateConfig(funds: string[]) {
    const config = workspace.getConfiguration()
    const favorites = unique([
      ...config.get('fund-watch.favorites', []),
      ...funds,
    ])
    config.update('fund-watch.favorites', favorites, true)
  },

  removeConfig(code: string) {
    const config = workspace.getConfiguration()
    const favorites: string[] = [...config.get('fund-watch.favorites', [])]
    const index = favorites.indexOf(code)
    if (index === -1) {
      return
    }
    favorites.splice(index, 1)
    config.update('fund-watch.favorites', favorites, true)
  },

  async getFavorites(order: number): Promise<FundItem[]> {
    const favorite: string[] = workspace
      .getConfiguration()
      .get('fund-watch.favorites', [])
    const infos = await fundApi([...favorite])
    const result = infos.map((info) => new FundItem(info))
    return result.sort(
      ({ info: { changeRate: a = 0 } }, { info: { changeRate: b = 0 } }) => {
        return +a >= +b ? order * 1 : order * -1
      }
    )
  },
}

export default fundHandle
