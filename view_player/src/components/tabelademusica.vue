<template>
  <span>
    <v-toolbar>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title> Play List </v-list-item-title>
            <v-list-item-subtitle>{{ tempoTotalText }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-btn
          color="corTema"
          dark
          class="fonte--text color corTema ma-0 pr-0"
          :icon="!($vuetify.breakpoint.width >= 400)"
          :loading="carregando"
          @click="acessarFiles"
        >
        <div v-if="$vuetify.breakpoint.width >= 400">Adicionar</div>
        <v-icon class="mx-2" color="fonte">
          mdi-plus
        </v-icon>
        </v-btn>
        <input
          ref="input"
          class="d-none"
          type="file"
          accept="audio/*"
          multiple
          @change="onFileChanged"
        >
    </v-toolbar>
    <v-simple-table v-if="$vuetify.breakpoint.width < 600">
      <template v-slot:default>

        <thead>
          <tr>
            <th class="text-left">
              Nome
            </th>
            <th class="text-left">
              Duração
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in musicas"
            :key="item.id"
            @click="selecionarMusica(item)"
          >
            <td>
              <div v-if="item.id===id" :class="corAtual">{{ item.name }} - {{ item.artista }}</div>
              <div v-else-if="corAtual">{{ item.name }} - {{ item.artista }}</div>
            </td>
            <td>
              <div v-if="item.id===id" :class="corAtual">{{ item.duracaoText }}</div>
              <div v-else-if="corAtual">{{ item.duracaoText }}</div>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-data-table
      v-if="$vuetify.breakpoint.width > 600"
      class="elevation-1 mt-2"
      :headers="titulos"
      hide-default-footer
      :items="musicas"
      no-data-text="Play List Vazia"
      loading-text="Carregando... Por favor, aguarde!"
      :items-per-page="controladorMusicas+1"
      :disable-pagination="false"
      @click:row="selecionarMusica($event)"
      >
      <template v-slot:[`item.name`]="{ item }">
        <div v-if="item.id===id" :class="corAtual">{{ item.name }}</div>
        <div v-else-if="corAtual">{{ item.name }}</div>
      </template>
      <template v-slot:[`item.artista`]="{ item }">
        <div v-if="item.id===id" :class="corAtual">{{ item.artista }}</div>
        <div v-else-if="corAtual">{{ item.artista }}</div>
      </template>
      <template v-if="$vuetify.breakpoint.width >= 600" v-slot:[`item.duracaoText`]="{ item }">
        <div v-if="item.id===id" :class="corAtual">{{ item.duracaoText }}</div>
        <div v-else-if="corAtual">{{ item.duracaoText }}</div>
      </template>
      <template v-slot:[`item.curtida`]="{ item }">
        <div v-if="item.curtida===false">
        <v-icon
          @click.prevent.stop="item.curtida = !item.curtida"
        >
          mdi-heart-outline
          {{ item.curtida }}
        </v-icon>
        </div>
        <div v-else>
        <v-icon
          @click.prevent.stop="item.curtida = !item.curtida"
          color="corTema"
        >
          mdi-heart
          {{ item.curtida }}
        </v-icon>
        </div>
      </template>
      <template v-slot:[`item.acao`]="{ item }">
        <v-icon
          small
          @click.prevent.stop="deletefaixa(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </span>
</template>

<script>
import moment from 'moment'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'TabelaMusica',
  data () {
    return {
      titulos: [
        {
          text: '#',
          align: 'center',
          sortable: false,
          value: 'id',
          width: 5
        },
        {
          text: 'Nome',
          align: 'start',
          sortable: false,
          value: 'name'
        },
        {
          text: 'Artista',
          align: 'start',
          sortable: false,
          value: 'artista'
        },
        {
          text: 'Duração',
          align: 'start',
          sortable: false,
          value: 'duracaoText'
        },
        {
          text: '',
          align: 'end',
          sortable: false,
          value: 'curtida'
        },
        {
          text: '',
          align: 'start',
          sortable: false,
          value: 'acao'
        }
      ],
      musicas: [],
      arquivos: [],
      controleAleatorio: {
        aleatorio: false,
        tocadas: [],
        naoTocadas: []
      },
      capa: require('@/assets/logo.png'),
      id: 0,
      controladorMusicas: 0,
      corAtual: 'primary--text',
      carregando: false,
      carregamento: false,
      tempoTotalValue: 0,
      tempoTotalText: '29:01'
    }
  },
  watch: {
    id (value) {
      const lista = this.musicas.find(item => item.id === value)
      this.$emit('mudancaCapa', lista.capa)
      this.carregarMusica(lista)
    },
    idtocando (value) {
      if (this.controleAleatorio.aleatorio === false) {
        if (value > this.controladorMusicas) this.id = 1
        else if (value < 1) this.id = this.controladorMusicas
        else this.id = value
      } else {
        this.modoAleatorio()
      }
    },
    aleatorio (value) {
      this.controleAleatorio.aleatorio = value
    },
    arquivos (value) {
      this.carregamento = true
      const promisses = []
      value.forEach((element, index) => {
        promisses.push(new Promise((resolve, reject) => {
          var reader = new FileReader()
          reader.readAsBinaryString(element)
          reader.onloadend = () => {
            const audioCtx = new Audio(URL.createObjectURL(element))
            audioCtx.onloadeddata = () => {
              const picture = reader.result.match(/\x89PNG[\x00-\xFF]+IEND|\x89JPEG[\x00-\xFF]+IEND|\xFF\xD8\xFF(?:\xE0|\xEE|\xE1|\xDB)[\x00-\xFF]+\xFF[\xD8-\xD9]{1}/)
              this.tempoTotalText = this.setDuration(this.tempoTotalValue += audioCtx.duration)
              const texto = element.name.split(' - ')
              resolve({
                id: index + 1,
                name: (texto[0]).replace('.mp3', ''),
                arquivo: URL.createObjectURL(element),
                artista: texto[1] !== undefined ? String(texto[1]).replace('.mp3', '') : 'desconhecido',
                duracaoText: this.setDuration(audioCtx.duration),
                duracaoValue: audioCtx.duration,
                capa: picture ? 'data:;base64,' + btoa(picture) : require('@/assets/logo.png'),
                curtida: false
              })
            }
          }
        }))
      })
      Promise.all(promisses).then((values) => {
        this.musicas = [...values]
        this.musicas.sort((a, b) => {
          if (a.id > b.id) return 1
          if (a.id < b.id) return -1
          return 0
        })
        this.controladorMusicas = this.musicas.length
        this.controleAleatorio.naoTocadas = this.musicas.map((valor) => valor.id)
        this.carregamento = false
        this.carregarfaixas = this.musicas
        this.id = 1
      })
    }
  },
  created () {
    const res = this.listarMusicas()
    res.then((values) => {
      this.musicas = [...values]
      this.musicas.sort((a, b) => {
        if (a.id > b.id) return 1
        if (a.id < b.id) return -1
        return 0
      })
      this.musicas.map((e) => {
        this.tempoTotalText = this.setDuration(this.tempoTotalValue += e.duracaoValue)
        return true
      })
      this.controladorMusicas = this.musicas.length
      this.controleAleatorio.naoTocadas = this.musicas.map((valor) => valor.id)
      this.id = 5
      this.carregarfaixas = this.musicas
    })
  },
  computed: {
    ...mapState('app', ['idtocando', 'aleatorio'])
  },
  methods: {
    ...mapActions('app', ['carregarMusica', 'carregarfaixas', 'listarMusicas']),
    acessarFiles () {
      this.carregando = true
      // After obtaining the focus when closing the FilePicker, return the button state to normal
      window.addEventListener('focus', () => {
        this.carregando = false
      }, { once: true })

      this.$refs.input.click()
    },
    onFileChanged (e) {
      this.arquivos = [...this.arquivos, ...this.$refs.input.files]
    },
    modoAleatorio () {
      if (this.controleAleatorio.naoTocadas.length === 0) {
        this.controleAleatorio.naoTocadas = this.controleAleatorio.tocadas
        this.controleAleatorio.tocadas = []
      }
      const sorteado = this.controleAleatorio.naoTocadas.sort(() => Math.random() - 0.5)[0]
      const novaLista = this.controleAleatorio.naoTocadas.filter((valor) => valor !== sorteado)
      this.controleAleatorio.naoTocadas = novaLista
      this.controleAleatorio.tocadas.push(sorteado)
      this.id = sorteado
    },
    selecionarMusica (event) {
      this.id = event.id
    },
    addZero (i) {
      if (i < 10) {
        i = '0' + i
      } return i
    },
    deletefaixa (musica) {
      if (musica.id === this.id && this.controladorMusicas === 1) {
        this.carregarMusica(
          {
            id: 0,
            name: 'Gloria Groove',
            arquivo: '',
            artista: 'Gloria Groove',
            duracaoText: '02:32',
            duracaoValue: 0,
            capa: require('@/assets/logo.png')
          }
        )
        this.capa = require('@/assets/logo.png')
      }
      const index = this.musicas.findIndex(element => element.id === musica.id)
      this.musicas.splice(index, 1)
      this.tempoTotalValue = 0
      this.musicas.forEach((value, index) => {
        this.tempoTotalText = this.setDuration(this.tempoTotalValue += value.duracaoValue)
        value.id = index + 1
      })
      if (musica.id === this.id) {
        const lista = this.musicas.find(item => item.id === 1)
        this.id = lista.id
        this.capa = lista.capa
        this.carregarMusica(lista)
      }
      this.controladorMusicas = this.musicas.length
    },
    setDuration (duracao) {
      const tempoTotal = moment.duration(duracao, 's')
      const h = this.addZero(tempoTotal.hours())
      const m = this.addZero(tempoTotal.minutes())
      const s = this.addZero(tempoTotal.seconds())
      if (h === '00') return `${m}:${s}`
      else return `${h}:${m}:${s}`
    }
  }
}
</script>

<style>

</style>
