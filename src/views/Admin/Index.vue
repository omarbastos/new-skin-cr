<template>
  <v-container ma-0 pa-0 fluid>
    <v-btn color="white" fab bottom left fixed @click.stop="drawer = !drawer"
      ><v-icon color="secondary">mdi-menu</v-icon></v-btn
    >
    <v-navigation-drawer
      color="secondary"
      dark
      v-model="drawer"
      fixed=""
      temporary
    >
      <v-list nav dense>
        <v-list-item-group v-model="item" color="black">
          <v-list-item link :to="item.to" v-for="(item, i) in items" :key="i">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="logout" link>
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-container>
      <v-row>
        <v-col cols="12"><ventas></ventas></v-col>
        <v-col cols="12"> <ordenes></ordenes></v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import Ventas from './Ventas';

import Ordenes from './Ordenes';
export default {
  components: {
    Ventas,
    Ordenes,
  },
  data: () => ({
    item: null,
    mini: true,
    drawer: true,
    items: [
      {
        title: 'Banner',
        icon: 'mdi-bullhorn',
        to: '/admin/banner',
      },
      {
        title: 'Productos',
        icon: 'mdi-package-variant',
        to: '/admin/products',
      },

      {
        title: 'Usuarios',
        icon: 'mdi-account-group',
        to: '/admin/usuarios',
      },

      {
        title: 'Ordenes',
        icon: 'mdi-truck-delivery',

        to: '/admin/ordenes',
      },

      {
        title: 'Costos De Envio',
        icon: 'mdi-cash',

        to: '/admin/costos-de-envio',
      },
      {
        title: 'Categorias',
        icon: 'mdi-label-multiple',

        to: '/admin/category',
      },

      {
        title: 'Colores',
        icon: 'mdi-palette',

        to: '/admin/colors',
      },

      {
        title: 'Tallas',
        icon: 'mdi-format-size',

        to: '/admin/size',
      },
    ],
  }),

  methods: {
    logout() {
      this.$store.dispatch('auth/SIGN_OUT').then(() => {
        this.$router.push({ name: 'Home' });
      });
    },
  },
};
</script>
<style scoped>
.v-card {
  transform: scale(1.05);
  transition: all 0.5s ease-in-out;
}

.v-card:not(.on-hover) {
  transform: scale(1);
}

.show-btns {
  color: rgba(255, 255, 255, 1) !important;
}
</style>
