<template>
  <v-main>
    <v-overlay :value="overlay" :absolute="false">
        <v-progress-circular
          indeterminate
          size="80"
          width="7"
          color="primary"
        ></v-progress-circular>
        <v-spacer></v-spacer>
        <div class="ma-2">Aguarde</div>
    </v-overlay>
    <letra
      :value="letras.value"
      :alinhamento="letras.alinhamento"
      :artista="letras.artista"
      :letra="letras.letra"
      :letraTraducao="letras.letraTraducao"
      :nomeMusica="letras.nomeMusica"
      :nomeTraducao="letras.nomeTraducao"
      :urlletra="letras.urlletra"
      :imagemTocador="musicaAtual.capa"
      :modoAleatorio="aleatorio"
      :modoTocando="tocando"
      :repeticaoFaixa="repetirFaixa"
      :tempoAtualtexto="tempoAtualTexto"
      :tempoAtualvalue="tempoAtualValue"
      :tempoFinaltexto="musicaAtual.duracaoText"
      :tempoFinalvalue="musicaAtual.duracaoValue"
      :silenciar="mudo"
      :volumeFaixa="volume"
      :velocidades="items"
      @MudacaTempo="seek"
      @VelocidadeAlterada="alterarVelocidade"
      @alteracaoVolume="mudarVolume"
      @SilenciarFaixa="mudo = !mudo"
      @ClickAleatorio="aleatorio = !aleatorio"
      @fechar="letras.value = false"
      @FaixaAnterior="anteriorFaixa"
      @ClickTocando="tocando = !tocando"
      @ProximaFaixa="mudancaDeFaixa"
      @RepetirFaixa="repetirFaixa = !repetirFaixa"
    />
    <audio
      ref="audio"
      @pause="tocando = false"
      @play="tocando = true"
      @ended="mudancaDeFaixa"
      @timeupdate="mudarTempo"
      @volumechange="volume == 0 ? (mudo = false) : null"
      @error="$emit('error', $event)"
      @loadstart="overlay = true"
      @loadeddata="carregarRestante()"
      @canplay="carregamentoMusica()"
      :src="musicaAtual.arquivo"
    />
    <v-container class="mb-1">
      <v-row>
        <v-col
          cols="12"
          xl="12"
          lg="12"
          md="12"
          sm="12"
          xs="12"
          class="mt-10 pa-0"
        >
          <v-slider
            color="corTema"
            min="0"
            max="100"
            :value="parseInt((tempoAtualValue / musicaAtual.duracaoValue) * 100) || 0"
            @input="seek($event)"
          >
            <template v-slot:prepend>
              <div class="ml-5 pt-1">
                {{ tempoAtualTexto }}
              </div>
            </template>
            <template v-slot:append>
              <div class="mr-5 pt-1">
                {{ musicaAtual.duracaoText }}
              </div>
            </template>
          </v-slider>
        </v-col>
      </v-row>
      <v-row class="px-5">
        <img
          class="pt-1 mt-1"
          v-show="!($vuetify.breakpoint.name === 'xs')"
          height="50"
          :src="musicaAtual.capa ? musicaAtual.capa : ''"
        >
        <v-col
          cols="6"
          xl="4"
          lg="4"
          md="4"
          sm="6"
          class="pa-0 ma-0"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <marquee v-if="(musicaAtual.name.length>20) && ($vuetify.breakpoint.name === 'xs')" direction="left">{{ musicaAtual.name }}</marquee>
                <div v-else>{{ musicaAtual.name }}</div>
                </v-list-item-title>
              <v-list-item-subtitle>
                <marquee v-if="(musicaAtual.name.length>20) && ($vuetify.breakpoint.name === 'xs')" direction="left">{{ musicaAtual.artista }}</marquee>
                {{ musicaAtual.artista }}
                </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col
          cols="6"
          xl="2"
          lg="2"
          md="2"
          sm="3"
          class="d-flex align-center justify-center pa-0"
        >
          <v-btn v-show="!($vuetify.breakpoint.name === 'xs')" icon @click="aleatorio = !aleatorio">
            <v-icon :color="aleatorio ? 'red' : ''">mdi-square-wave</v-icon>
          </v-btn>
          <v-btn icon @click="anteriorFaixa">
            <v-icon>mdi-rewind</v-icon>
          </v-btn>
          <v-btn icon @click="tocando = !tocando">
            <v-icon>{{ tocando ? "mdi-pause" : "mdi-play" }}</v-icon>
          </v-btn>
          <v-btn icon @click="mudancaDeFaixa">
            <v-icon>mdi-fast-forward </v-icon>
          </v-btn>
          <v-btn v-show="!($vuetify.breakpoint.name === 'xs')" icon @click="repetirFaixa = !repetirFaixa">
            <v-icon :color="repetirFaixa ? 'red' : ''">{{ repetirFaixa ? "mdi-repeat-once" : "mdi-repeat" }}</v-icon>
          </v-btn>
        </v-col>
        <v-spacer
          v-show="($vuetify.breakpoint.width >= 900 )"
        />
        <v-col
          cols="6"
          xl="2"
          lg="2"
          md="2"
          sm="6"
          class="px-0"
        >
          <v-hover
            v-slot="{ hover }">
            <v-card max-height="35">
              <v-btn
                absolute
                icon
                right
              >
                <v-icon @click="mutarSom" :color="mudo ? 'red' : ''">
                  {{ mudo ? "mdi-volume-off" : "mdi-volume-high" }}
                </v-icon>
              </v-btn>
              <v-expand-transition>
                <div v-if="hover">
                <v-slider
                  class="pt-1 my-0 mr-14"
                  color="corTema"
                  min="0"
                  max="100"
                  :value="parseInt(volume * 100) || 0"
                  @input="mudarVolume($event)"
                >
                </v-slider>
                </div>
              </v-expand-transition>
            </v-card>
          </v-hover>
        </v-col>
        <v-menu
          transition="slide-x-transition"
          bottom
          right
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-show="($vuetify.breakpoint.width >= 830 )"
              class="pt-0 mt-3"
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>
                {{ "mdi-clock-fast" }}
              </v-icon>
          </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="(item, i) in items"
              :key="i"
            >
              <v-list-item-title @click="alterarVelocidade(i)">{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-col
          cols="6"
          xl="1"
          lg="1"
          md="1"
          sm="6">
          <v-btn
            class="mt-0"
            icon
            @click.stop="letras.value = true"
          >
          <v-badge
            dot
            color="corTema"
            :value="letras.exibir"
          >
            <v-icon>mdi-text</v-icon>
          </v-badge>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <div class="color pa-0 ma-0" id="wave"></div>
  </v-main>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import letra from '../components/letramusica.vue'

export default {
  name: 'TocadorMusic',
  components: { letra },
  data () {
    return {
      items: [
        { title: '2x' },
        { title: '1.75x' },
        { title: '1.5x' },
        { title: 'normal' },
        { title: '0.5x' },
        { title: '0.75x' },
        { title: '0.25x' }
      ],
      idtocando: 0,
      dialog: false,
      tempoAtualValue: 0,
      tempoAtualTexto: '00:00',
      tocando: false,
      mudo: false,
      aleatorio: false,
      repetirFaixa: false,
      volume: 1,
      letras: {
        alinhamento: 'left',
        artista: 'Gloria Groove',
        letra: 'Paixão\nFaz um tempo eu quero te encontrar\nTomando um vinho\nTu senta e relaxa aqui no meu sofá\n\nTesão\nVocê sabe me excitar\nTeu jeito mandrake me deixa maluca\nHoje eu quero te\n\nEu desço rebolando pra ti\nCom a mão no popozão\nMeu vestido vermelho carmim\nTe deixou galudão\nEsse teu beiço tão vermelhin\nCor de malícia\nAi, que delícia\n\nNa boca vermelho cereja\nNo teto vermelho neon\nVermelho que nem a lanterna traseira\nDa nave que toca esse som\n\nQuem é essa menina de vermelho?\nEu vim pro baile só pra ver\nEla rebolando até o chão\n\nÔ, ôô, ôô\nVermelho',
        letraTraducao: '',
        nomeMusica: 'Vermelho',
        nomeTraducao: '',
        urlletra: 'https://www.vagalume.com.br/gloria-groove/vermelho.html',
        value: false,
        exibir: false
      },
      velocidade: 1,
      corTema: null,
      carregamento: false,
      overlay: false,
      wavesurfer: null
    }
  },
  mounted () {
    if (localStorage.getItem('user:nome')) {
      this.overlay = false
    }
  },
  watch: {
    corTema (value) {
      const hex = value
      var nib = hex.split('')

      var r = parseInt(nib[1] + nib[2], 16)
      var g = parseInt(nib[3] + nib[4], 16)
      var b = parseInt(nib[5] + nib[6], 16)

      var luminosidade = (r * 299 + g * 587 + b * 114) / 1000
      if (luminosidade > 50) {
        this.$vuetify.theme.themes.dark.fourth = '#191414'
        this.$vuetify.theme.themes.dark.corTema = this.corTema
        if (luminosidade > 100) this.$vuetify.theme.themes.dark.fonte = '#000000'
      } else {
        this.$vuetify.theme.themes.dark.fonte = '#ffffff'
        this.$vuetify.theme.themes.dark.corTema = '#1db954'
        this.$vuetify.theme.themes.dark.fourth = '#ffffff'
      }
    },
    aleatorio (value) {
      this.ativarAleatorio(value)
    },
    tocando (value) {
      if (value) {
        return this.$refs.audio.play()
      }
      this.$refs.audio.pause()
    },
    mudo (value) {
      this.$refs.audio.muted = !(this.$refs.audio.muted)
      return this.$refs.audio.muted
    }
  },
  computed: {
    ...mapState('app', ['musicaAtual'])
  },
  methods: {
    ...mapActions('app', ['carregarId', 'ativarAleatorio']),
    construirOndas () {
      function arredonda (v) {
        return 5 * (Math.round(v / 5))
      }
      function componentToHex (c) {
        var hex = c.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }
      function rgbToHex (r, g, b) {
        return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
      }
      const t = new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        img.src = this.musicaAtual.capa
        img.onload = function () {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const context = canvas.getContext('2d')

          context.drawImage(img, 0, 0)

          const map = context.getImageData(0, 0, img.width, img.height).data

          let hex, r, g, b
          const histograma = {}
          for (let i = 0, len = map.length; i < len; i += 4) {
            r = arredonda(map[i])
            g = arredonda(map[i + 1])
            b = arredonda(map[i + 2])
            // alpha = map[i+2]; //ignora canal alpha

            hex = rgbToHex(r, g, b)

            if (histograma[hex] === undefined) {
              histograma[hex] = 1
            } else {
              histograma[hex]++
            }
          }
          let corMaisComum = null
          let frequenciaCorMaisComum = 0
          for (const cor in histograma) {
            if (frequenciaCorMaisComum < histograma[cor]) {
              corMaisComum = cor
              frequenciaCorMaisComum = histograma[cor]
            }
          }
          resolve(corMaisComum)
        }
      })
      t.then((res) => {
        this.corTema = res
      })
    },
    carregarRestante () {
      this.construirOndas()
      this.idtocando = this.musicaAtual.id
      document.title = this.musicaAtual.name
      this.carregarLetra()
      this.overlay = false
    },
    carregamentoMusica () {
      setTimeout(() => {
        this.$refs.audio.play()
        this.overlay = false
      }, 300)
    },
    mudancaDeFaixa () {
      if (this.repetirFaixa === false) {
        this.idtocando += 1
        this.carregarId(this.idtocando)
      } else {
        this.$refs.audio.load()
        this.$refs.audio.play()
      }
    },
    carregarLetra () {
      if (this.musicaAtual.artista === 'desconhecido') {
        this.letras.exibir = false
      } else {
        const res = new Promise((resolve, reject) => {
          var xhr = new XMLHttpRequest()
          xhr.withCredentials = false

          xhr.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
              resolve(JSON.parse(this.responseText))
            }
          })

          const t = 'https://api.vagalume.com.br/search.php?art=' + this.musicaAtual.artista + '&mus=' + this.musicaAtual.name + '&apikey=%7Bkey%7D'
          xhr.open('GET', t)
          xhr.send()
        })
        res.then((response) => {
          if (response.type === 'exact' || response.type === 'aprox') {
            const letter = document.createElement('p')
            letter.innerText = response.mus[0].text
            this.letras.letra = letter.innerHTML
            this.letras.urlletra = response.mus[0].url
            this.letras.artista = this.musicaAtual.artista
            this.letras.nomeMusica = this.musicaAtual.name
            try {
              const traducao = document.createElement('p')
              traducao.innerText = response.mus[0].translate[0].text
              const inicio = traducao.innerText.indexOf('[')
              const final = traducao.innerText.indexOf(']')
              this.letras.nomeTraducao = traducao.innerText.substring(inicio + 1, final)
              if (traducao.innerHTML.includes(']<br><br>')) {
                const recorte = traducao.innerHTML.substring(inicio, final + 9)
                this.letras.letraTraducao = traducao.innerHTML.replace(recorte, '')
              } else if (traducao.innerHTML.includes(']<br>')) {
                const recorte = traducao.innerHTML.substring(inicio, final + 5)
                this.letras.letraTraducao = traducao.innerHTML.replace(recorte, '')
              } else if (traducao.innerHTML.includes('] <br><br>')) {
                const recorte = traducao.innerHTML.substring(inicio, final + 10)
                this.letras.letraTraducao = traducao.innerHTML.replace(recorte, '')
              }
              this.letras.alinhamento = 'right'
            } catch (error) {
              this.letras.letraTraducao = ''
              this.letras.nomeTraducao = ''
              this.letras.alinhamento = 'left'
            }
            this.letras.exibir = true
          } else {
            this.letras.letra = 'Infelimante não encontramos a letra dessa música'
            this.letras.urlletra = null
            this.letras.nomeTraducao = null
            this.letras.letraTraducao = null
            this.letras.alinhamento = 'left'
            this.letras.artista = this.musicaAtual.artista
            this.letras.nomeMusica = this.musicaAtual.name
            this.letras.exibir = false
          }
        })
      }
    },
    alterarVelocidade (a) {
      if (a === 0) { this.$refs.audio.playbackRate = 2 }
      if (a === 1) { this.$refs.audio.playbackRate = 1.75 }
      if (a === 2) { this.$refs.audio.playbackRate = 1.5 }
      if (a === 3) { this.$refs.audio.playbackRate = 1.0 }
      if (a === 4) { this.$refs.audio.playbackRate = 0.5 }
      if (a === 5) { this.$refs.audio.playbackRate = 0.75 }
      if (a === 6) { this.$refs.audio.playbackRate = 0.25 }
      this.velocidade = this.$refs.audio.playbackRate
    },
    seek (percentual) {
      if (percentual !== 100) this.$refs.audio.currentTime = Math.round(this.$refs.audio.duration * (percentual / 100))
    },
    mudarVolume (percentual) {
      if (percentual === 0) {
        this.mudo = true
      } else if (percentual > 0 && percentual < 100) {
        this.$refs.audio.volume = percentual / 100
        this.volume = this.$refs.audio.volume
        this.mudo = false
      }
    },
    mutarSom () {
      if (this.volume < 0.03) this.mudo = !this.mudo
    },
    addZero (i) {
      if (i < 10) {
        i = '0' + i
      } return i
    },
    anteriorFaixa () {
      if (this.tempoAtualValue > 1) {
        this.$refs.audio.load()
        this.$refs.audio.play()
      }
      this.idtocando -= 1
      this.carregarId(this.idtocando)
    },
    mudarTempo () {
      this.tempoAtualValue = this.$refs.audio.currentTime
      const tempoAtual = moment.duration(this.tempoAtualValue, 's')
      const m = this.addZero(tempoAtual.minutes())
      const s = this.addZero(tempoAtual.seconds())
      this.tempoAtualTexto = `${m}:${s}`
    }
  }
}
</script>
