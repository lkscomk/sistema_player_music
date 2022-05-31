import axios from '@/plugins/axios'

export const carregarfaixas = ({ commit }, faixas) => {
  commit('setFaixas', faixas)
}
export const ativarAleatorio = ({ commit }, aleatorio) => {
  commit('setAleatorio', aleatorio)
}
export const carregarId = ({ commit }, id) => {
  commit('setId', id)
}
export const carregarMusica = ({ commit }, musica) => {
  commit('setMusica', musica)
}
export const listarMusicas = async ({ commit }) => {
  try {
    const res = await axios.get('/musicas')
    commit('musicasPadrao', res.data)
    return res.data
  } catch (error) {
    return null
  }
}
