<template>
  <div>
    <v-card>
      <v-row class="fill-height fill-width pa-10"
        align="center"
        justify="center">
          <v-img :src="capa" :max-width="tamanho"></v-img>
      </v-row>
      <v-divider></v-divider>
      <v-card-text>
        <tabelademusica/>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import tabelademusica from '@/components/tabelademusica.vue'

export default {
  components: { tabelademusica },
  name: 'BarraMusic',
  data () {
    return {
      tamanho: 500,
      capa: require('@/assets/logo.png')
    }
  },
  mounted () {
    this.mudancaTamanho()
  },
  methods: {
    mudancaTamanho () {
      const tamanho = this.$vuetify.breakpoint.width
      if (tamanho >= 1600) this.tamanho = 450
      else if (tamanho >= 1200) this.tamanho = 400
      else if (tamanho >= 900) this.tamanho = 350
      else if (tamanho >= 600) this.tamanho = 300
      else if (tamanho >= 300) this.tamanho = 200
      else if (tamanho >= 200) this.tamanho = 100
      else if (tamanho >= 200) this.tamanho = 50
    }
  }
}
</script>
