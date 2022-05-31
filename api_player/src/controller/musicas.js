const fs = require('fs')
const past = require('path')

module.exports = app => {
    const listarmusicas = async (req, res) => {
        try {
            res.header("Access-Control-Allow-Origin", "*")
            const caminho = past.resolve(__dirname,'..','db','config.json')
            const conteudo = fs.readFileSync(caminho, 'utf-8')
            const config = JSON.parse(conteudo)
            res.send(config)
        } catch (error) {
            return res.json({erro: error.message})
        }
    }

    const exibirmusica = async (req, res) => {
        try {
            console.log(res)
            res.header("Access-Control-Allow-Origin", "*")
            const caminho = past.resolve(__dirname,'..','db','config.json')
            const conteudo = fs.readFileSync(caminho, 'utf-8')
            const config = JSON.parse(conteudo)
            const novo = config.find(itens => String(itens.id) === String(req.params.id))

            const path = past.resolve(__dirname,'..','assets/audio', novo.arquivo)
            const stat = fs.statSync(path)
            const fileSize = stat.size
            const range = req.headers.range

            if (range) {
                const parts = range.replace(/bytes=/, "").split("-")
                const start = parseInt(parts[0], 10)
                const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize-1

                if(start >= fileSize) {
                res.status(416).send('Requested range not satisfiable\n'+start+' >= '+fileSize);
                return
                }

                const chunksize = (end-start)+1
                const file = fs.createReadStream(path, {start, end})
                const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'audio/mp3',
                }

                res.writeHead(206, head)
                file.pipe(res)
            } else {
                const head = {
                'Content-Length': fileSize,
                'Content-Type': 'audio/mp3',
                }
                res.writeHead(200, head)
                fs.createReadStream(path).pipe(res)
            }
        } catch (error) {
            return res.json({erro: error.message})
        }
    }

    const exibircapa = async (req, res) => {
        try {
            const caminho = past.resolve(__dirname,'..','db','config.json')
            const conteudo = fs.readFileSync(caminho, 'utf-8')
            const config = JSON.parse(conteudo)
            const novo = config.find(itens => String(itens.id) === String(req.params.id))

            const path = past.resolve(__dirname,'..','assets/img', novo.capa)
            const stat = fs.statSync(path)
            const fileSize = stat.size
            res.header("Access-Control-Allow-Origin", "*")
            const range = req.headers.range

            if (range) {
                const parts = range.replace(/bytes=/, "").split("-")
                const start = parseInt(parts[0], 10)
                const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize-1

                if(start >= fileSize) {
                res.status(416).send('Requested range not satisfiable\n'+start+' >= '+fileSize);
                return
                }

                const chunksize = (end-start)+1
                const file = fs.createReadStream(path, {start, end})
                const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'image/png',
                }

                res.writeHead(206, head)
                file.pipe(res)
            } else {
                const head = {
                'Content-Length': fileSize,
                'Content-Type': 'image/png',
                }
                res.writeHead(200, head)
                fs.createReadStream(path).pipe(res)
            }
        } catch (error) {
            return res.json({erro: error.message})
        }
    }

return {
    listarmusicas,
    exibirmusica,
    exibircapa,
}}
