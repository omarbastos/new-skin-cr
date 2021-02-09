<template>
  <v-row justify="center" align="center">
    <v-col justify="center" align="center" cols="12" md="6">
      <v-card elevation="12">
        <v-card-title class="secondary white--text font-weight-bold"
          >TOTAL DEL CARRITO</v-card-title
        >
        <v-card-text>
          <v-row>
            <v-col cols="8"> Sub-total</v-col>
            <v-col cols="4" class="font-weight-bold">
              {{ subtotal | formatNumber }}
            </v-col>

            <v-col cols="8"> Costo de envio total:</v-col>
            <v-col cols="4" class="font-weight-bold">{{
              costoEnvio | formatNumber
            }}</v-col>

            <v-col cols="8"> Costo Total:</v-col>
            <v-col cols="4" class="font-weight-bold"
              >{{ total | formatNumber }}
            </v-col>
          </v-row>
        </v-card-text>
        <div>
          <v-container class="d-flex justify-center align-center flex-column">
            <v-btn @click="saveAndCreate" block color="secondary"
              >SI, CORRECTO</v-btn
            >

            <v-btn
              @click="$router.back()"
              class="my-2"
              block
              color="secondary"
              outlined=""
              >CANCELAR</v-btn
            ></v-container
          >
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { db } from '@/api/firebase.js';
import { mapState } from 'vuex';
export default {
  props: ['total', 'subtotal', 'costoEnvio'],
  computed: {
    ...mapState('auth', ['user']),
  },
  methods: {
    saveAndCreate() {
      db.collection('users')
        .doc(this.user.uid)
        .update({
          shippingAddress: this.user.shippingAddress,
          billingAddress: this.user.billingAddress,
        })
        .then(() => {
          this.$emit('goToPaypal');
        });
    },
  },
};
</script>

<style></style>
