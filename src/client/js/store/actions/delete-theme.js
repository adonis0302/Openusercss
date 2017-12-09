import router from '../../router'
import {deleteTheme as deleteThemeRemote} from './helpers/remotes/mutations'

export default async ({commit, getters}, {id, redirect}) => {
  commit('loading', true)

  try {
    await deleteThemeRemote(id, getters.session.token)
    commit('deleteTheme', id)
    commit('actionError', null)
    router.push(redirect)
  } catch (error) {
    commit('actionError', error.message)
  }

  commit('loading', false)
}
