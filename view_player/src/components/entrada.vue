<template>
  <v-row justify="center">
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
    <v-dialog
      :value="value"
      persistent
      overlay-opacity="100"
      max-width="600px"
    >
      <v-card v-if="controle">
        <v-card-title class="ml-3">
          Entrar
        </v-card-title>
        <v-card-text>
          <validation-observer ref="observer">
          <v-container>
            <v-row>
              <v-col
              cols="12"
              >
              <validation-provider
                v-slot="{ errors }"
                :rules="{
                  required: true,
                  email: true,
                  max: 100
                }"
                name="Email"
                vid="email"
              >
                <v-text-field
                label="Email*"
                v-model="formularioEntrada.email"
                :error-messages="errors"
                :hide-details="!errors.length"
                required
                @keydown.enter="salvarUser()"
                ></v-text-field>
              </validation-provider>
              </v-col>
              <v-col cols="12">
              <validation-provider
                v-slot="{ errors }"
                :rules="{
                  required: true,
                  max: 100,
                  min: 6
                }"
                name="Senha"
                vid="senha"
              >
                <v-text-field
                  label="Senha*"
                  :type="mostrarSenha ? 'text' : 'password'"
                  :append-icon="mostrarSenha ? 'mdi-eye' : 'mdi-eye-off'"
                  v-model="formularioEntrada.senha"
                  :error-messages="errors"
                  :hide-details="!errors.length"
                  required
                  @click:append="mostrarSenha = !mostrarSenha"
                  @keydown.enter="salvarUser()"
                ></v-text-field>
              </validation-provider>
              </v-col>
            </v-row>
          </v-container>
          </validation-observer>
          <small>*campo obrigatório</small>
        </v-card-text>
        <v-card-actions>
           <v-btn
              color="primary .text-h6"
              text
              small
              @click="controle = !controle"
            >
              Não possui cadastro?
            </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="salvarUser()"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-if="!controle">
        <v-card-title>
          <span class="text-h5">Cadastre - Se</span>
        </v-card-title>
        <v-card-text>
          <validation-observer ref="observer">
          <v-container>
            <v-row>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  :rules="{
                    required: true,
                    alpha: true,
                    max: 100
                  }"
                  name="Nome"
                  vid="nome"
                >
                  <v-text-field
                    label="Nome*"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    v-model="formularioCadastro.nome"
                    required
                    @keydown.enter="cadastrarUser()"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  :rules="{
                    required: true,
                    email: true,
                    max: 100
                  }"
                  name="Email"
                  vid="email"
                >
                  <v-text-field
                    label="Email*"
                    v-model="formularioCadastro.email"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    required
                    @keydown.enter="cadastrarUser()"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  :rules="{
                    required: true,
                    min: 8
                  }"
                  name="Senha"
                  vid="senha"
                >
                  <v-text-field
                    label="Senha*"
                    :type="mostrarSenha ? 'text' : 'password'"
                    :append-icon="mostrarSenha ? 'mdi-eye' : 'mdi-eye-off'"
                    v-model="formularioCadastro.senha"
                    :error-messages="errors"
                    :hide-details="!errors.length"
                    @click:append="mostrarSenha = !mostrarSenha"
                    @keydown.enter="cadastrarUser()"
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
          </v-container>
          </validation-observer>
          <small>*Campos Obrigatórios</small>
        </v-card-text>
        <v-card-actions>
          <v-btn
              color="primary .text-h6"
              text
              small
              @click="controle = !controle"
            >
              Já possui cadastro?
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="cadastrarUser()"
          >
            Cadastrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="aviso.snackbar"
      :timeout="aviso.timeout"
    >
      {{ aviso.text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="primary"
          text
          v-bind="attrs"
          @click="aviso.snackbar = false"
        >
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'EntradaUser',
  data: () => ({
    controle: true,
    overlay: false,
    formularioEntrada: {
      email: null,
      senha: null
    },
    formularioCadastro: {
      nome: null,
      email: null,
      senha: null
    },
    aviso: {
      snackbar: false,
      text: '',
      timeout: 3000
    },
    mostrarSenha: false,
    dialog: true
  }),
  props: {
    value: {
      default: true,
      type: Boolean
    }
  },
  watch: {
    nome (novo) {
      this.nome = novo.toUpperCase()
    }
  },
  methods: {
    ...mapActions('auth', [
      'entrar',
      'cadastrar'
    ]),
    async salvarUser () {
      this.overlay = true
      this.$refs.observer.reset()
      if (await this.$refs.observer.validate()) {
        const dados = {
          email: this.formularioEntrada.email,
          senha: btoa(this.formularioEntrada.senha)
        }
        const res = await this.entrar(dados)
        if (res && !res.erro) {
          localStorage.setItem('user:token', res.token)
          localStorage.setItem('user:nome', res.payload.name)
          this.$router.push('/')
        } else {
          this.aviso.snackbar = true
          this.aviso.text = res.mensagem
        }
      }
      this.overlay = false
    },
    async cadastrarUser () {
      this.$refs.observer.reset()
      if (await this.$refs.observer.validate()) {
        const dados = {
          nome: this.formularioCadastro.nome,
          email: this.formularioCadastro.email,
          senha: btoa(this.formularioCadastro.senha)
        }
        const res = await this.cadastrar(dados)
        if (res && !res.erro) {
          localStorage.setItem('user:token', res.token)
          localStorage.setItem('user:nome', res.payload.name)
          this.$router.push('/')
        } else {
          this.aviso.snackbar = true
          this.aviso.text = res.mensagem
        }
      }
    }
  }
}
</script>
