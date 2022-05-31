export default {
  setAleatorio (state, payload) {
    state.aleatorio = payload
  },
  setMusica (state, payload) {
    if (payload.capa === false) {
      payload.capa = require('@/assets/logo.png')
    }
    state.musicaAtual = payload
  },
  setId (state, payload) {
    state.idtocando = payload
  },
  setFaixas (state, payload) {
    state.faixas = payload
  },
  musicasPadrao (state, payload) {
    payload.forEach(element => {
      element.arquivo = `${process.env.VUE_APP_API}/musicas/${element.id}`
      // eslint-disable-next-line no-constant-condition
      element.capa = `${process.env.VUE_APP_API}/capa/${element.id}` ? `${process.env.VUE_APP_API}/capa/${element.id}` : require('@/assets/logo.png')
    })
    state.musicasOriginais = payload
  }
}
