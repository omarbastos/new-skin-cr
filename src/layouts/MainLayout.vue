<template>
  <v-content :class="blueBackground ? 'blue-background' : ''" fluid pa-0 ma-0>
    <header-bar :user="user"></header-bar>
    <v-container mx-0 pa-0 fluid style="margin-top:64px; margin-bottom:300px">
      <v-btn
        color="secondary"
        fab=""
        fixed
        bottom=""
        left=""
        :x-large="$vuetify.breakpoint.mdAndUp"
        v-if="rutasPublicas"
        @click="$router.back()"
        ><v-icon>mdi-arrow-left</v-icon></v-btn
      >
      <transition name="slide-fade" mode="out-in">
        <router-view />
      </transition>
    </v-container>
    <footer-bar v-if="!blueBackground"></footer-bar>
  </v-content>
</template>

<script>
import HeaderBar from '@/components/HeaderBar/Index.vue';

import FooterBar from '@/components/FooterBar/Index.vue';
import { mapState } from 'vuex';
export default {
  name: 'MainLayout',
  components: {
    HeaderBar,
    FooterBar,
  },
  computed: {
    rutasPublicas() {
      if (
        this.$route.name === 'Home' ||
        this.$route.name === 'Catalogo' ||
        this.$route.name === 'Admin'
      ) {
        return false;
      } else {
        return true;
      }
    },
    ...mapState('auth', {
      loggedIn: 'loggedIn',
      user: 'user',
    }),

    blueBackground() {
      let ruta = this.$route;
      if (
        ruta.name === 'Login' ||
        ruta.name === 'Profile' ||
        ruta.name === 'Register' ||
        ruta.name === 'Product' ||
        ruta.name === 'Paypal'
      ) {
        return true;
      } else return false;
    },
  },
};
</script>
<style>
.blue-background {
  background: url('../assets/img/blue-background.svg');
  background-position: center center;
  background-size: cover;
}
</style>
