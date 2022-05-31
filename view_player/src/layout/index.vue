<template>
  <v-main>
    <v-app-bar elevation="5" app>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-list-item>
        <v-list-item-content>
          <v-list-item-title> Bem Vindo (a), {{ nome }} </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-app-bar>
      <!-- <v-navigation-drawer
        v-model="drawer"
        absolute
        temporary
      >
      <span>Desenvolvido por Lukas</span>
      <span>V. 1.0.1</span>
      </v-navigation-drawer> -->

    <!-- TODO: Transição do router -->
    <v-container>
      <router-view />
    </v-container>
    <!-- TODO: Footer -->
    <v-footer
      app
      :height="$vuetify.breakpoint.width >= 600 ? '210' : '250'"
    >
    <tocador class="pa-0 ma-0"/>
    </v-footer>
    <v-footer app class=".d-flex justify-center pa-0 ma-0">
      <div class="text-caption"><strong >developed by Lukas. V. 1.8.0</strong></div>
    </v-footer>
  </v-main>
</template>

<script>
import tocador from '@/components/tocador.vue'

export default {
  name: 'LayoutSistema',
  components: { tocador },
  data: () => ({
    drawer: false,
    group: null,
    nome: ''
  }),
  watch: {
    group () {
      this.drawer = false
    }
  },
  created () {
    this.pegarNomeStore()
  },
  methods: {
    pegarNomeStore () {
      if (localStorage.getItem('user:nome')) {
        this.entrada = false
        this.nome = localStorage.getItem('user:nome')
      }
    }
  }
}
</script>
