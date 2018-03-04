export const state = () => ({
  'authentication': false,
  'data':           false,
})

export const mutations = {
  loading (state, {scope, isLoading,}) {
    state[scope] = isLoading
  },
}
