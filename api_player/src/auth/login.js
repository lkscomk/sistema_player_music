const past = require('path')
const fs = require('fs')
const jwt = require('jsonwebtoken')
module.exports = app => {
    const login = async (req, res, next) => {
        try {
            const caminho = past.resolve(__dirname,'..','db','arquivoGerado.json')
            const conteudo = fs.readFileSync(caminho, 'utf-8')
            const config = JSON.parse(conteudo)
            const login = config.find(itens => String(itens.email) === String(req.body.email) && String(req.body.senha) === String(itens.senha))

            const token = jwt.sign({data: {name: login.nome, email: login.email}

            }, 'lukas', {expiresIn: '3h'});

            if (login) res.send({token, payload: {name: login.nome, email: login.email}})
            else res.json({ mensagem: 'Senha ou email incorreto.' })
        } catch (error) {
            return res.json({erro: error.message})
        }
    }
// Exporta a função login para ser acessada de forma externa pelo arquivo de rotas.

return {login}
}
