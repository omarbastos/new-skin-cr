<template>
  <v-card elevation="0" dark tile style="border-radius:7px">
    <v-img src="../../assets/img/DestacadosCard.svg">
      <v-container>
        <v-card-title>{{ price | formatNumber }}</v-card-title>
        <v-card-subtitle class=" white--text"> {{ titulo }}</v-card-subtitle>
        <v-img
          :src="imgSrc ? imgSrc : require('../../assets/img/Mascarilla1 1.png')"
        ></v-img>
        <div class="d-flex justify-center align-center">
          <v-btn
            :to="'/product/' + uid"
            color="primary"
            class="mx-auto elevation-12"
            rounded
          >
            Añadir al carrito</v-btn
          >
        </div>
      </v-container></v-img
    >
  </v-card>
</template>

<script>
export default {
  props: {
    price: {
      type: Number,
      default: 0,
    },
    titulo: {
      type: String,
      default: 'No existe nombre en este articulo',
    },

    uid: {
      type: String,
    },
    imgSrc: {
      type: String,
      default: require('../../assets/img/Mascarilla1 1.png'),
    },
  },
};
</script>

<style></style>
