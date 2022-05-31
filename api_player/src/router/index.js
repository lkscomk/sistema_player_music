const path = require('path');
module.exports = app => {
  app.get('/musicas/:id', app.src.controller.musicas.exibirmusica)
  app.get('/capa/:id', app.src.controller.musicas.exibircapa)
  app.post('/login', app.src.auth.login.login)
  app.post('/cadastro', app.src.controller.usuario.salvar)
  app.all('*/', app.src.auth.verifyToken.verify)
  app.get('/musicas', app.src.controller.musicas.listarmusicas)
}


