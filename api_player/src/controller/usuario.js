const past = require('path')
const fs = require('fs')
const jwt = require('jsonwebtoken')
module.exports = (app) => {
    const salvar = async (req, res) => {
        try {
            const caminho = past.resolve(__dirname,'..','db','arquivoGerado.json')
            const conteudo = fs.readFileSync(caminho, 'utf-8')
            const config = JSON.parse(conteudo)
            const login = config.find(itens => String(itens.email) === String(req.body.email))
            if (login) res.json({ mensagem: 'Já existe uma conta cadastrada com esse email.'})
            else {
                let pessoa = {
                    nome: req.body.nome,
                    senha: req.body.senha,
                    email: req.body.email
                }
                config.push(pessoa)
                fs.writeFile(caminho, JSON.stringify(config), err => { err || typeof pessoa })
                const token = jwt.sign({data: {name: pessoa.nome, email: pessoa.email}
                }, 'lukas', {expiresIn: '3h'});

                res.json({token, payload: {name: pessoa.nome, email: pessoa.email}})
            }
        } catch (error) {
            return res.json({ erro: error.message })
        }
    }
    return {
        salvar
    }
}
