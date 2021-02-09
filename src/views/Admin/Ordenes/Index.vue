<template>
  <v-container>
    <v-card>
      <v-card-title>
        Lista de Ordenes
        <v-spacer></v-spacer>
      </v-card-title>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="search"
            class="ml-8"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field
        ></v-col>
        <!--  <v-col cols="12" md="6">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="dates"
            transition="scale-transition"
            offset-y
          >
            <template v-slot:activator="{ on, attrs }">
              <v-toolbar class="my-4" elevation="0" color="transparent">
                <v-combobox
                  v-model="dates"
                  multiple
                  chips
                  small-chips
                  label="Filtrar por Fechas"
                  readonly
                  outlined=""
                  filled=""
                  rounded=""
                  v-bind="attrs"
                  v-on="on"
                >
                  <template v-slot:append-outer>
                    <v-icon @click="clearOrdenes">mdi-close</v-icon>
                  </template>
                </v-combobox>
                <v-spacer></v-spacer> <v-spacer></v-spacer>
              </v-toolbar>
            </template>
            <v-date-picker v-model="dates" multiple no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
              <v-btn text color="primary" @click="getOrderByDate">OK</v-btn>
            </v-date-picker>
          </v-menu></v-col
        > -->
      </v-row>

      <v-data-table
        :headers="headers"
        :items="customOrdenes.length > 0 ? customOrdenes : ordenes"
        :items-per-page="15"
        :search="search"
        show-expand
        single-expand=""
        class="elevation-1"
        sort-by="createdAt"
        sort-desc=""
        @click:row="goToOrder"
      >
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <ul>
              <li v-for="producto in item.productos" :key="producto.id">
                {{ producto.producto.productName }}:{{ producto.quanty }}
              </li>
            </ul>
          </td>
        </template>
        <template v-slot:item.paypal.status="{ item }">
          <span :class="item.paypal ? 'green--text ' : 'red--text '">{{
            item.paypal ? item.paypal.status : 'SIN PROCESAR'
          }}</span>
        </template>
        <template v-slot:item.total="{ item }">
          <span class=" text-capitalize"> {{ item.total | formatNumber }}</span>
        </template>
        <template v-slot:item.createdAt="{ item }">
          <span class=" text-capitalize">{{
            item.createdAt.toDate() | formatDate
          }}</span>
        </template>
      </v-data-table>
    </v-card></v-container
  >
</template>

<script>
const orders = db.collection('ordenes');

import { db } from '@/api/firebase.js';
export default {
  data() {
    return {
      headers: [
        { text: 'ID', align: 'center', value: 'uid' },
        { text: 'USUARIO', align: 'center', value: 'user.email' },
        { text: 'ESTATUS', align: 'center', value: 'paypal.status' },
        {
          text: 'FECHA',
          align: 'center',

          value: 'createdAt',
        },
        { text: 'TOTAL  ₡', align: 'center', value: 'total' },
      ],
      ordenes: [],
      dates: [],
      search: this.$route.query.email ? this.$route.query.email : '',
      menu: false,
      customOrdenes: [],
    };
  },

  firestore() {
    return {
      ordenes: db.collection('ordenes'),
    };
  },
  computed: {
    total() {
      const reducer = (acumulator, item) => {
        return acumulator + item.total;
      };
      const total = this.ordenes.reduce(reducer, 0);
      return total;
    },
  },
  methods: {
    clearOrdenes() {
      this.dates = [];
      this.$bind(
        'customOrdenes',
        orders.where('createdAt', '>', 0).where('createdAt', '<', 0)
      );
    },
    getOrderByDate() {
      this.$refs.menu.save(this.dates);
      let start = new Date(this.dates[0]);
      let end = new Date(this.dates[1]);
      this.$bind(
        'customOrdenes',
        orders.where('createdAt', '>', start).where('createdAt', '<', end)
      );
    },
    goToOrder(item) {
      this.$router.push({
        name: 'Admin/OrderProfile',
        params: {
          id: item.uid,
        },
      });
    },
  },
};
</script>
