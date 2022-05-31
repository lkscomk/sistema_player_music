require('dotenv').config()
const express = require('express')
const fs = require('fs')
const cors = require('cors')
const consign = require('consign')
const bodyParser = require('body-parser')
const pth = require('path')
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static(pth.join(__dirname, 'public')))

consign()
    .include('./src/controller')
    .include('./src/auth')
    .include('./src/router')
    .into(app)

// Inicialização do serviço
app.listen(3000, () => {
    console.log(`Rodando na porta 3000`)
})
