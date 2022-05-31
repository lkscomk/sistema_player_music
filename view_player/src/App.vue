<template>
  <v-app>
      <router-view/>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data: () => ({
    versao: '1.0.0'
  })
}
</script>
