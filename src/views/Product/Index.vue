<template>
  <v-content ma-0 pa-0 fluid>
    <v-container>
      <v-sheet
        v-if="!product.productImage"
        color="lighten-4"
        class="px-3 pt-3 pb-3"
      >
        <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
      </v-sheet>
      <v-card v-else elevation="12">
        <v-container>
          <v-row justify="center" align="center">
            <v-col cols="12" md="4" justify="center" align="center">
              <v-card-title class="font-weight-bold flex-column d-flex"
                >{{ product.productName }} <br />
                <span class="text--secondary">
                  Precio: {{ product.productPrice | formatNumber }}</span
                ></v-card-title
              >
              <v-img
                contain
                class="my-12"
                style="border-radius:18px"
                max-height="200"
                :src="
                  product.productImage
                    ? product.productImage
                    : require('@/assets/img/Products/preview.png')
                "
                aspect-ratio="1"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="primary"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
              <!--   <v-btn class="elevation-0 mt-12" color="transparent"
                ><v-icon>mdi-share</v-icon>Compartir</v-btn
              > -->
            </v-col>

            <v-col cols="12" md="4" justify="center" align="center">
              <v-card-text>
                <v-form dark ref="form" v-model="valid" lazy-validation>
                  <v-row justify="center" align="center">
                    <v-col cols="12" justify="center" align="center">
                      <v-select
                        required
                        :rules="[(v) => !!v || 'Obligatorio']"
                        v-model="color"
                        label="Color"
                        item-text="name"
                        item-value="name"
                        return-object=""
                        :items="product.productColor"
                      >
                        <template v-slot:append>
                          <v-icon :color="color.hex">mdi-circle</v-icon>
                        </template>
                      </v-select></v-col
                    >

                    <v-col cols="12" justify="center" align="center">
                      <v-select
                        required
                        :rules="[(v) => !!v || 'Obligatorio']"
                        v-model="size"
                        label="Talla"
                        item-text="name"
                        item-value="name"
                        return-object=""
                        :items="product.productSize"
                      ></v-select
                    ></v-col>
                  </v-row>
                </v-form>
                <br />

                <v-chip color="secondary">{{ product.productCategory }}</v-chip
                ><br /><br />
                <v-btn-toggle class="my-4 elevation-12">
                  <v-btn @click="decrease" color="#C7EAFE">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>

                  <v-btn color="white" class="font-weight-bold">
                    {{ quanty }}
                  </v-btn>

                  <v-btn @click="increase" color="#C7EAFE">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-btn-toggle>
                <br /><br />
                <span class="font-weight-bold "> Stock: </span>
                {{ product.productInventory }}
                <br /><br />
                <span class="font-weight-bold "> Codigo: </span>
                {{ product.productCodigo }}
              </v-card-text>
            </v-col>
            <v-col cols="12" md="4" justify="center" align="center">
              <v-card-subtitle class="text-justify font-weight-bold"
                ><br />{{ product.productDescription }}<br
              /></v-card-subtitle>
              <v-card-actions>
                <v-btn
                  v-animate-css.hover="'bounceIn'"
                  color="primary"
                  rounded
                  x-large
                  block
                  :disabled="!valid"
                  @click="onSubmit"
                  v-text="' Añadir al Carrito'"
                ></v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-container>
    <v-overlay opacity="1" color="primary" :value="isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-content>
</template>
<script>
import { db } from '@/api/firebase.js';
export default {
  data: () => ({
    quanty: 1,
    product: [],
    valid: false,
    color: {
      name: 'N/A',
      hex: '#000000',
    },
    size: null,
    isLoading: false,
  }),

  firestore() {
    return {
      product: db.collection('catalogo').doc(this.$route.params.id),
    };
  },
  computed: {
    colorSelected() {
      return this.color.name;
    },
  },
  methods: {
    decrease() {
      if (this.quanty == 0) {
        return;
      } else {
        this.quanty = this.quanty - 1;
      }
    },
    increase() {
      if (this.quanty >= this.product.productInventory) {
        return;
      } else {
        this.quanty++;
      }
    },
    onSubmit(ev) {
      ev.preventDefault();
      if (this.$refs.form.validate()) {
        this.isLoading = true;
        if (this.$store.state.auth.loggedIn) {
          this.addCart();
        } else {
          this.$router.push({ name: 'Login' });
        }
      }
    },
    addCart() {
      let datos = {
        producto: db.collection('catalogo').doc(this.product.uid),
        quanty: this.quanty,
        color: this.color,
        size: this.size,
        uid: db.collection('users').doc(this.$store.state.auth.user.uid),
      };

      this.$store
        .dispatch('cart/ADD_ITEM', datos)
        .then(() => {
          this.isLoading = false;
          this.$router.back();
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<style scoped>
.v-card {
  border-radius: 18px !important;
}
.theme--light.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  background-color: #f5f5f5 !important;
}
</style>
