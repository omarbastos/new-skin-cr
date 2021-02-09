<template>
  <v-hover v-slot:default="{ hover }">
    <v-card
      min-width="300"
      min-height="230"
      :class="{ 'on-hover': hover }"
      outlined
      style="border-radius: 10px;"
      :elevation="hover ? 12 : 2"
    >
      <v-row>
        <v-col cols="7">
          <v-container>
            <v-card-title
              style="word-break: keep-all;"
              class="font-weight-bold"
            >
              <!--     <v-btn
        fab
        absolute=""
        top=""
        right=""
        dark
        v-animate-css.hover="'bounceIn'"
        color="accent"
      >
        <v-icon class="icon-product" dark>mdi-cart</v-icon> </v-btn
      > -->{{ card.productName }}
            </v-card-title>
            <v-card-subtitle>
              {{ card.productPrice | formatNumber }}
            </v-card-subtitle>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                block=""
                :to="'/product/' + card.uid"
                v-animate-css.hover="'bounceIn'"
                color="primary"
                rounded
              >
                AÑADIR AL CARRITO
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions> </v-container
        ></v-col>
        <v-col cols="5">
          <v-img
            :src="
              card.productImage
                ? card.productImage
                : require('@/assets/img/Products/preview.png')
            "
            aspect-ratio="1.5"
            contain
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>
      </v-row>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  props: {
    card: {
      type: Object,
    },
    tasa: {
      type: Number,
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
