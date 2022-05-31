<template>
  <v-row justify="center">
    <v-dialog
      :value="value"
      scrollable
      :overlay-opacity="0.8"
      no-click-animation
      :max-width="$vuetify.breakpoint.width - 100"
      @click:outside="$emit('fechar')"
    >
      <v-card>
        <v-card-title
          v-show="$vuetify.breakpoint.width < 1265"
          class="ml-3 mt-3 pa-0">
          <v-btn
          class="ma-0 pa-0"
          color="corTema"
          icon
          @click="$emit('fechar')"
          >
          <v-icon>mdi-arrow-left-bold</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-row class="pt-5 px-0 corTema">
            <v-col class="color">
              <div :align='alinhamento' class="fonte--text text-subtitle-1"><strong>{{ nomeMusica }}</strong></div>
              <div :align='alinhamento' class="fonte--text">{{ artista }}</div>
            </v-col>
            <v-col class="color">
              <div class="fonte--text text-subtitle-1"><strong>{{ nomeTraducao }}</strong></div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <div :align='alinhamento' v-html="letra"></div>
            </v-col>
            <v-col>
              <div v-html="letraTraducao"></div>
            </v-col>
          </v-row>
          <br>
          <a :href="urlletra" target="_blank" class="color corTema--text">Fonte: vagalume</a>
        </v-card-text>

        <v-card-actions>
        <v-container class="mb-5">
          <v-row>
            <v-col
            cols="12"
            xl="12"
            lg="12"
            md="12"
            sm="12"
            xs="12"
            class="pa-0 mt-5 color"
            >
            <v-slider
            min="0"
            max="100"
            color="corTema"
            :value="parseInt((tempoAtualvalue / tempoFinalvalue) * 100) || 0"
            @input="$emit('MudacaTempo', $event)"
            >
            <template v-slot:prepend>
            <div class="ml-5 pt-1">
              {{ tempoAtualtexto }}
            </div>
            </template>
            <template v-slot:append>
            <div class="mr-5 pt-1">
              {{ tempoFinaltexto }}
            </div>
            </template>
            </v-slider>
            </v-col>
          </v-row>
          <v-row class="px-5">
            <img
            class="pt-1 mt-1"
            v-show="$vuetify.breakpoint.width > 700"
            height="50"
            :src="imagemTocador"
            >
            <v-col
            cols="5"
            xl="4"
            lg="4"
            md="4"
            sm="4"
            class="pa-0 ma-0"
            v-show="$vuetify.breakpoint.width > 500"
            >
            <v-list-item >
            <v-list-item-content>
              <v-list-item-title>
                <marquee v-if="(nomeMusica.length>20) && ($vuetify.breakpoint.name === 'xs')" direction="left">{{ nomeMusica }}</marquee>
                <div v-else>{{ nomeMusica }}</div>
              </v-list-item-title>
              <v-list-item-subtitle>
                <marquee v-if="(artista.length>20) && ($vuetify.breakpoint.name === 'xs')" direction="left">{{ artista }}</marquee>
                {{ artista }}
              </v-list-item-subtitle>
            </v-list-item-content>
            </v-list-item>
            </v-col>
            <v-spacer/>
            <v-col
            cols="3"
            xl="2"
            lg="2"
            md="2"
            sm="3"
            class="d-flex align-center justify-center pa-0"
            >
            <v-btn v-show="!($vuetify.breakpoint.name === 'xs')" icon @click="$emit('ClickAleatorio')">
            <v-icon :color="modoAleatorio ? 'primary' : ''">mdi-square-wave</v-icon>
            </v-btn>
            <v-btn icon @click="$emit('FaixaAnterior')">
            <v-icon>mdi-rewind</v-icon>
            </v-btn>
            <v-btn icon @click="$emit('ClickTocando')">
            <v-icon>{{ modoTocando ? "mdi-pause" : "mdi-play" }}</v-icon>
            </v-btn>
            <v-btn icon @click="$emit('ProximaFaixa')">
            <v-icon>mdi-fast-forward </v-icon>
            </v-btn>
            <v-btn v-show="!($vuetify.breakpoint.name === 'xs')" icon @click="$emit('RepetirFaixa')">
            <v-icon :color="repeticaoFaixa ? 'primary' : ''">{{ repeticaoFaixa ? "mdi-repeat-once" : "mdi-repeat" }}</v-icon>
            </v-btn>
            </v-col>
            <v-spacer/>
            <v-col
            cols="4"
            xl="2"
            lg="2"
            md="3"
            sm="3"
            class="px-0"
            v-show="$vuetify.breakpoint.width > 734"
            >
              <v-hover
                v-slot="{ hover }">
                <v-card max-height="35">
                  <v-btn
                    absolute
                    icon
                    right
                  >
                    <v-icon @click="$emit('SilenciarFaixa')" :color="silenciar ? 'red' : ''">
                      {{ silenciar ? "mdi-volume-off" : "mdi-volume-high" }}
                    </v-icon>
                  </v-btn>
                  <v-expand-transition>
                    <div v-if="hover">
                    <v-slider
                      class="pt-1 my-0 mr-14 color"
                      min="0"
                      max="100"
                      color="corTema"
                      :value="parseInt(volumeFaixa * 100) || 0"
                      @input="$emit('alteracaoVolume', $event)"
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
            v-show="$vuetify.breakpoint.width > 939"
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
            v-for="(item, i) in velocidades"
            :key="i"
            >
            <v-list-item-title @click="$emit('VelocidadeAlterada', i)">{{ item.title }}</v-list-item-title>
            </v-list-item>
            </v-list>
            </v-menu>
            <v-btn
              v-show="$vuetify.breakpoint.width >= 1265"
              class="mt-3"
              color="corTema"
              text
              @click="$emit('fechar')"
              >
              Voltar
            </v-btn>
          </v-row>
        </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'LetraMusic',
  props: {
    value: {
      default: false,
      type: Boolean,
      required: true
    },
    alinhamento: {
      default: 'left',
      type: String
    },
    artista: {
      default: null,
      type: String
    },
    letra: {
      default: 'Infelimante não encontramos a letra dessa música',
      type: String
    },
    letraTraducao: {
      default: null,
      type: String
    },
    nomeMusica: {
      default: null,
      type: String
    },
    nomeTraducao: {
      default: null,
      type: String
    },
    urlletra: {
      default: null,
      type: String
    },
    imagemTocador: {
      default: require('@/assets/logo.png'),
      type: String
    },
    modoAleatorio: {
      default: false,
      type: Boolean
    },
    modoTocando: {
      default: true,
      type: Boolean
    },
    silenciar: {
      default: false,
      type: Boolean
    },
    repeticaoFaixa: {
      default: false,
      type: Boolean
    },
    tempoAtualtexto: {
      default: '00:00',
      type: String
    },
    tempoAtualvalue: {
      default: 0,
      type: Number
    },
    tempoFinaltexto: {
      default: '00:00',
      type: String
    },
    tempoFinalvalue: {
      default: 0,
      type: Number
    },
    volumeFaixa: {
      default: 100,
      type: Number
    },
    velocidades: {
      default: null,
      type: Array
    }
  },
  computed: {
    ...mapState(['faixas'])
  }
}
</script>
