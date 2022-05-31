import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

import pt from 'vuetify/lib/locale/pt'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#1db954',
        secondary: '#009C4D',
        corTema: '#1db954',
        botao: '#1db954',
        fonte: '#ffffff',
        accent: '#A1AA8C',
        error: '#eb2f06',
        info: '#2979FF',
        success: '#009C4D',
        warning: '#F2C037',
        background: '#191414'
      }
    }
  },
  lang: {
    locales: { pt },
    current: 'pt'
  }
})
