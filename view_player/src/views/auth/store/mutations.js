export default {
  registros (state, param) {
    const funcaoEnum = {
      COLABORADOR: 1,
      GERENTE: 2
    }
    param.forEach(element => {
      if (element.funcaoId === funcaoEnum.GERENTE) element.funcaoDescricao = 'Gerente'
      if (element.funcaoId === funcaoEnum.COLABORADOR) element.funcaoDescricao = 'Colaborador'
    })
    state.registros = param
  },
  reset: () => {}
}
