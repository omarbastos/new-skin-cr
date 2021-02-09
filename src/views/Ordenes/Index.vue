<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="ordenes"
      :items-per-page="5"
      class="elevation-1"
      sort-by="createdAt"
      sort
      sort-desc=""
      @click:row="goToOrder"
    >
      <template v-slot:item.paypal.status="{ item }">
        <span
          :class="
            item.paypal
              ? 'green--text font-weight-bold'
              : 'red--text font-weight-bold'
          "
          >{{ item.paypal ? item.paypal.status : 'SIN PROCESAR' }}</span
        >
      </template>
      <template v-slot:item.createdAt="{ item }">
        <span class="font-weight-bold text-capitalize">{{
          item.createdAt.toDate() | formatDate
        }}</span>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { db } from '@/api/firebase.js';
export default {
  data() {
    return {
      headers: [
        { text: 'ID de la Orden', value: 'uid' },

        {
          text: 'Fecha',
          align: 'start',
          sortable: false,
          value: 'createdAt',
        },
        { text: 'Total', value: 'total' },
        { text: 'Estatus', value: 'paypal.status' },
      ],
      ordenes: [],
    };
  },
  firestore() {
    return {
      ordenes: db
        .collection('ordenes')
        .where(
          'user',
          '==',
          db.collection('users').doc(this.$store.state.auth.user.uid)
        ),
    };
  },
  methods: {
    goToOrder(item) {
      this.$router.push({
        name: 'Paypal',
        params: {
          id: item.uid,
        },
      });
    },
  },
};
</script>
