const dotenv = require('dotenv')
const env = dotenv.config({ path: '.env' }).parsed

process.env.VUE_APP_API = env.PLAYER_API

module.exports = {
  transpileDependencies: [
    'vuetify'
  ]
}
