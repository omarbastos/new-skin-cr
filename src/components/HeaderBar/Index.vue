<template>
  <v-app-bar fixed color="white">
    <router-link to="/">
      <div class="d-flex align-center justify-center">
        <img height="50" src="@/assets/img/logo.png" />
        <img height="50" src="@/assets/img/logoletras.png" /></div
    ></router-link>
    <v-spacer></v-spacer>
    <template v-if="$vuetify.breakpoint.mdAndUp">
      <v-btn to="/" text class="primary--text mx-2">
        Home
      </v-btn>
      <v-btn
        v-if="$route.name === 'Home'"
        @click="$vuetify.goTo('#destacados')"
        text
        class="primary--text mx-2"
      >
        Destacados
      </v-btn>
      <v-btn to="/catalogo" text class="primary--text mx-2">
        Catálogo
      </v-btn>
      <v-btn
        v-if="$route.name === 'Home'"
        @click="$vuetify.goTo('#contactanos')"
        text
        class="primary--text mx-2"
      >
        Contáctanos
      </v-btn>
      <template v-if="$store.getters['auth/isLoggedIn']">
        <template v-if="!isAdmin">
          <v-btn class="mr-4" to="/carrito" icon>
            <v-icon color="primary">mdi-cart</v-icon>
          </v-btn>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-avatar
                v-on="on"
                v-if="user && user.pic"
                width="48"
                height="48"
              >
                <v-img
                  style="border:3px solid #19A7F6"
                  :src="user.pic"
                  aspect-ratio="1"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="primary fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-avatar>
              <v-avatar
                v-on="on"
                color="primary"
                width="48"
                height="48"
                v-else
                class="d-flex justify-center align-center"
              >
                <span class="white--text headline">{{
                  initials
                }}</span></v-avatar
              >
            </template>
            <v-list>
              <v-list-item to="/profile">
                <v-list-item-title>Perfil</v-list-item-title>
              </v-list-item>
              <v-list-item to="/ordenes">
                <v-list-item-title>Ordenes</v-list-item-title>
              </v-list-item>
              <v-list-item @click="logout">
                <v-list-item-title>Cerrar Sesión</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template v-else>
          <v-btn to="/admin" color="primary">Panel Admin</v-btn>
        </template>
      </template>
      <v-btn v-else to="/login" rounded color="primary">Iniciar Sesión</v-btn>
    </template>

    <template v-else>
      <v-spacer></v-spacer>
      <v-menu class="px-8" offset-y>
        <template v-slot:activator="{ on }">
          <v-btn
            class=" font-weight-bold"
            text
            color="primary"
            light
            icon
            v-on="on"
          >
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>
        <v-list dark class="primary">
          <v-list-item to="/">
            <v-list-item-title class="d-flex align-center"
              >Home</v-list-item-title
            >
          </v-list-item>
          <v-list-item v-if="$route.name === 'Home'" to="/destacados">
            <v-list-item-title class="d-flex align-center"
              >Destacados</v-list-item-title
            >
          </v-list-item>
          <v-list-item to="/catalogo">
            <v-list-item-title class="d-flex align-center"
              >Catalogo</v-list-item-title
            >
          </v-list-item>
          <v-list-item v-if="$store.getters['auth/isLoggedIn']" to="/ordenes">
            <v-list-item-title class="d-flex align-center"
              >Ordenes</v-list-item-title
            >
          </v-list-item>
          <v-list-item v-if="$store.getters['auth/isLoggedIn']" to="/profile">
            <v-list-item-title class="d-flex align-center"
              >Perfil</v-list-item-title
            >
          </v-list-item>
          <v-list-item @click="logout" v-if="$store.getters['auth/isLoggedIn']">
            <v-list-item-title class="d-flex align-center"
              >Cerrar Sesion</v-list-item-title
            >
          </v-list-item>
          <v-list-item to="/login" v-else>
            <v-list-item-title class="d-flex align-center"
              >Iniciar Sesion</v-list-item-title
            >
          </v-list-item>
          <v-list-item to="/admin" v-if="isAdmin">
            <v-list-item-title class="d-flex align-center"
              >Panel Admin</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>
<script>
export default {
  name: 'Header',
  // Propiedades que soporta nuestro componente
  props: {
    user: {
      required: false,
      type: Object,
      default: null,
    },
  },
  data: () => ({ carritos: [] }),
  computed: {
    isAdmin() {
      if (this.user) {
        if (this.user.admin) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    initials() {
      if (this.user && this.user.firstName) {
        return (
          this.user.firstName.charAt(0) + this.user.lastName.charAt(0)
        ).toUpperCase();
      } else {
        return 'N';
      }
    },
  },
  methods: {
    logout() {
      const loading = this.$vs.loading({
        background: '#19A7F6',
        color: 'rgb(255, 255, 255)',

        opacity: '1',
      });
      this.$store.dispatch('auth/SIGN_OUT').then(() => {
        loading.close();
      });
    },
  },
};
</script>
<style scoped></style>
