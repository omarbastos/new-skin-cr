<template>
  <v-container class="d-flex justify-center align-center" style="height:100vh">
    <h1>
      Oops!! ¡Su email no ha sido verificado!
    </h1>
    <v-btn @click="verificar" :disabled="clicked" flat large color="primary"
      >Enviar nuevamente</v-btn
    >
  </v-container>
</template>

<script>
import { auth } from "@/api/firebase.js";
export default {
  data: () => ({
    clicked: false
  }),
  methods: {
    verificar() {
      this.clicked = true;
      auth.currentUser.reload(); // reloads user fields, like emailVerified:
      if (!auth.currentUser.emailVerified) {
        auth.currentUser.sendEmailVerification().then(() => {
          // console.log("Email enviado con exito");
        });
      }
    }
  }
};
</script>

<style lang="stylus"></style>
