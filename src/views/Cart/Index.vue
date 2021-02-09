<template>
  <v-content ma-0 px-0 pb-16 fluid>
    <v-container v-if="!preCompra">
      <v-row>
        <v-col cols="12" md="8">
          <div class="mb-4 title text--secondary font-weight-bold">
            CARRITO DE COMPRAS
          </div>
          <v-select
            outlined
            :items="costosDeEnvio"
            v-model="costoEnvio"
            item-text="text"
            item-value="value"
            return-object
            label="Seleccione el tipo de envio"
          ></v-select>
          <v-textarea
            outlined
            v-model="address"
            label="Direccion de Entrega"
          ></v-textarea>
          <v-sheet v-if="!carritos[0]" color="lighten-4" class="px-3 pt-3 pb-3">
            <v-container>
              <v-row>
                <v-col cols="12" v-for="i in 6" :key="i">
                  <v-skeleton-loader
                    class="mx-auto"
                    type="card"
                  ></v-skeleton-loader
                ></v-col>
              </v-row>
            </v-container>
          </v-sheet>

          <v-card
            v-else
            v-for="(carrito, index) in carritos"
            :key="index"
            elevation="0"
          >
            <v-container>
              <v-row>
                <v-col cols="12" md="4" justify="center" align="center">
                  <v-img
                    contain
                    :src="
                      carrito.producto.productImage
                        ? carrito.producto.productImage
                        : require('@/assets/img/Products/preview.png')
                    "
                    aspect-ratio="1.5"
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
                </v-col>
                <v-col cols="12" md="5" justify="start" align="center">
                  <v-container>
                    <v-card-title
                      style="word-break: keep-all;"
                      class="primary--text font-weight-bold"
                    >
                      {{ carrito.producto.productName }}
                    </v-card-title>
                    <v-card-subtitle class="text-start">
                      <span class="font-weight-bold">Codigo: </span>
                      {{ carrito.producto.productCodigo }} <br />
                      <span class="font-weight-bold"> Color: </span
                      >{{ carrito.color ? carrito.color.name : 'N/A' }} <br />
                      <span class="font-weight-bold"> Talla: </span
                      >{{ carrito.size ? carrito.size.name : 'N/A' }}

                      <br />
                      <span class="font-weight-bold"> Precio unitario: </span>

                      {{ carrito.producto.productPrice | formatNumber }}<br />

                      <span class="font-weight-bold">
                        {{
                          (carrito.producto.productPrice * carrito.quanty)
                            | formatNumber
                        }}</span
                      >
                    </v-card-subtitle>
                  </v-container></v-col
                >
                <v-col cols="12" md="3" justify="center" align="center">
                  <v-select
                    @change="updatedQuanty(carrito)"
                    v-model="carrito.quanty"
                    rounded=""
                    dense
                    hide-details=""
                    :items="quantyNumbers"
                  ></v-select>
                  <v-btn icon @click="deleteCarrito(carrito)" color="red"
                    ><v-icon>mdi-trash-can</v-icon></v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>TOTAL DEL CARRITO</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="8"> Sub-total</v-col>
                <v-col cols="4" class="font-weight-bold">
                  {{ subtotal | formatNumber }}
                </v-col>

                <v-col cols="8"> Costo de envio total:</v-col>
                <v-col cols="4" class="font-weight-bold">
                  {{ costoEnvio.value | formatNumber }}
                </v-col>

                <v-col cols="8"> Costo Total:</v-col>
                <v-col cols="4" class="font-weight-bold"
                  >{{ total | formatNumber }}
                </v-col>
              </v-row>
            </v-card-text>
            <div>
              <v-container
                class="d-flex justify-center align-center flex-column"
              >
                <v-btn
                  :disabled="!carritosEmpty"
                  @click="createOrder"
                  block
                  color="secondary"
                  >INICIAR COMPRA</v-btn
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
    </v-container>
  </v-content>
</template>

<script>
import { db, timestamp, fieldValue } from '@/api/firebase.js';
export default {
  components: {},
  data: () => ({
    carritos: [],
    address: '',
    costosDeEnvio: [],
    preCompra: false,
    costoEnvio: {
      text: 'Retiro en Tienda',
      value: 0,
      uid: 'H1URXQkEgQqDtgwDHzNp',
    },
  }),
  computed: {
    carritosEmpty() {
      return this.carritos && this.carritos.length > 0;
    },
    quantyNumbers() {
      let numbers = Array.from(Array(24), (_, i) => i + 1);

      return numbers;
    },
    subtotal() {
      let sumCarritos = this.carritos.map((item) => {
        return item.producto.productPrice * item.quanty;
      });
      return sumCarritos.reduce((a, b) => a + b, 0);
    },
    total() {
      return this.subtotal + this.costoEnvio.value;
    },
  },
  firestore() {
    return {
      carritos: db
        .collection('carrito')
        .where(
          'uid',
          '==',
          db.collection('users').doc(this.$store.state.auth.user.uid)
        ),
      costosDeEnvio: db.collection('costosDeEnvio').orderBy('value'),
    };
  },
  methods: {
    async createOrder() {
      const res = await this.$confirm(
        '¿Estas seguro de iniciar el proceso de compra?',
        {
          buttonTrueText: 'Si, estoy seguro',
          buttonFalseText: 'No, quiero volver',
          color: '#19A7F6',
          title: 'Confirmar Compra',
          persistent: true,
        }
      );
      if (res) {
        let order = {
          productos: this.carritos,
          createdAt: timestamp,
          total: this.total,
          costoDeEnvio: this.costoEnvio,
          address: this.address,
          user: db.collection('users').doc(this.$store.state.auth.user.uid),
          disabled: false,
        };
        db.collection('ordenes')
          .add(order)
          .then((response) => {
            db.collection('ordenes')
              .doc(response.id)
              .update({
                uid: response.id,
              })
              .then(() => {
                this.clearCart(response);
              });
          });
      }
    },
    decreaseInventory(response) {
      db.collection('carrito')
        .where(
          'uid',
          '==',
          db.collection('users').doc(this.$store.state.auth.user.uid)
        )
        .get()
        .then((querySnapshot) => {
          var batch = db.batch();
          querySnapshot.forEach(function(doc) {
            // For each doc, add a delete operation to the batch

            batch.update(doc.ref);
          });

          // Commit the batch
          return batch.commit();
        })
        .then(() => {
          this.$router.push({ name: 'Paypal', params: { id: response.id } });
        });
    },
    clearCart(response) {
      db.collection('carrito')
        .where(
          'uid',
          '==',
          db.collection('users').doc(this.$store.state.auth.user.uid)
        )
        .get()
        .then((querySnapshot) => {
          var batch = db.batch();
          querySnapshot.forEach(function(doc) {
            // For each doc, add a delete operation to the batch
            let data = doc.data();
            let id = data.producto.id;
            db.collection('catalogo')
              .doc(id)
              .update({
                productInventory: fieldValue.increment(-parseInt(data.quanty)),
              })
              .then(() => {});
            batch.delete(doc.ref);
          });
          // Commit the batch
          return batch.commit();
        })
        .then(() => {
          this.$router.push({ name: 'Paypal', params: { id: response.id } });
        });
    },
    updatedQuanty(item) {
      db.collection('carrito')
        .doc(item.id)
        .update({
          quanty: item.quanty,
        });
    },
    deleteCarrito(item) {
      db.collection('carrito')
        .doc(item.id)
        .delete();
    },
  },
};
</script>

<style></style>
