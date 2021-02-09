<template>
  <v-container>
    <div class="display-1 text-center gray--text font-weight-bold my-12">
      DESTACADOS
    </div>
    <v-row justify="space-around" align="center">
      <v-col md="3" cols="11" v-for="(destacado, index) in destacados" :key="index">
        <destacados-card :uid="destacado.uid" :price="destacado.productPrice" :titulo="destacado.productName" :imgSrc="destacado.productImage"></destacados-card>
      </v-col>
    </v-row>
    <div class="d-flex justify-center align-center">
      <v-btn to=/catalogo color="primary" x-large="" class="my-12" width="300"
        >VER MÁS</v-btn
      >
    </div>
  </v-container>
</template>

<script>

import { db } from "@/api/firebase.js";
export default {
  components: {
    "destacados-card": () => import("./DestacadosCard")
  },
  data:()=>({
    destacados:[]
  }),
 firestore() {
    return {
      destacados: db
        .collection("catalogo")
        .where(
          "destacados",
          "==", true
        )
    };
  },
};
</script>

<style></style>
