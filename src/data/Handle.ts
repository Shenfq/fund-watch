import { workspace } from 'vscode'
import { fundApi, unique } from '../utils'

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
    if (index === -1) return
    favorites.splice(index, 1)
    config.update('fund-watch.favorites', favorites, true)
  },

  async getFavorites(): Promise<FundInfo[]> {
    const favorite: string[] = workspace
      .getConfiguration()
      .get('fund-watch.favorites', [])
    const infos = await fundApi([...favorite])
    return infos
  },
}

export default fundHandle
