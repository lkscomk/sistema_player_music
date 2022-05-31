import axios from '@/plugins/axios'

export const entrar = async ({ commit }, body) => {
  try {
    const res = await axios.post('/login', {
      ...body
    })
    axios.defaults.headers.Authorization = 'Bearer ' + res.data.token
    return res.data
  } catch (error) {
    return null
  }
}
export const cadastrar = async ({ commit }, body) => {
  try {
    const res = await axios.post('/cadastro', {
      ...body
    })
    axios.defaults.headers.Authorization = 'Bearer ' + res.data.token
    return res.data
  } catch (error) {
    return null
  }
}
