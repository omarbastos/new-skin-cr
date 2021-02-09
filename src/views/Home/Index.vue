<template>
  <v-content mx-0 style="margin-top:64px" pa-0 fluid>
    <v-carousel
      hide-delimiter-background=""
      width="100vw"
      height="auto"
      delimit
    >
      <v-carousel-item
        v-for="(item, i) in sliders"
        :key="i"
        :src="item.downloadURL"
        reverse-transition="fade-transition"
        transition="fade-transition"
      ></v-carousel-item>
    </v-carousel>

    <destacados id="destacados"></destacados>
    <banner></banner>
    <contact id="contactanos"></contact>
  </v-content>
</template>
<script>
import { db } from "@/api/firebase.js";
export default {
  components: {
    destacados: () => import("./Destacados"),
    banner: () => import("./Banner"),
    contact: () => import("./Contacto")
  },
  firestore() {
    return {
      sliders: db.collection("banners").orderBy("num")
    };
  },
  data: () => ({
    sliders: []
  })
};
</script>

<style></style>
