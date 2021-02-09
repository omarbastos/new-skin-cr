<template>
  <v-container>
    <v-card>
      <v-card-title>
        Lista de Usuarios
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :search="search"
        :headers="headers"
        :items="usuarios"
        :items-per-page="5"
        class="elevation-1"
        @click:row="goToRow"
      >
        <template v-slot:item.dateCreated="{ item }">
          <span class="text-capitalize">{{
            item.dateCreated.toDate() | formatDate
          }}</span>
        </template>
        <template v-slot:item.nombre="{ item }">
          <span class=" text-capitalize">{{
            item.firstName + ' ' + item.lastName
          }}</span>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { db } from '@/api/firebase.js';
export default {
  data() {
    return {
      headers: [
        { text: 'ID', align: 'center', value: 'uid' },
        { text: 'EMAIL', align: 'center', value: 'email' },
        { text: 'NOMBRE', align: 'center', value: 'nombre' },
        {
          text: 'REGISTRO',
          align: 'center',

          value: 'dateCreated',
        },
      ],
      usuarios: [],
      dates: [],
      search: '',
      menu: false,
      customOrdenes: [],
    };
  },
  firestore() {
    return {
      usuarios: db.collection('users'),
    };
  },

  methods: {
    goToRow(item) {
      console.log(item);
      this.$router.push({
        name: 'Admin/Ordenes',
        query: { email: item.email },
      });
    },
  },
};
</script>
