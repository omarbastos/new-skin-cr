<template
  ><div>
    <v-container
      v-if="!isCompleted"
      class="d-flex justify-center align-center flex-column "
    >
      <div class="display-1 white--text text-center font-weight-bold my-12">
        ¡Estas a un paso de tener ese producto NewSkin que tanto te gusta!
      </div>

      <div
        :style="
          $vuetify.breakpoint.mdAndUp
            ? 'width: 50%; margin-left:auto; margin-right:auto; background-color:#ffffff;padding:30px; border-radius:10px; z-index:0'
            : 'width: 100%; margin-left:auto; margin-right:auto; background-color:#ffffff;padding:30px;border-radius:10px; z-index:0'
        "
        ref="paypal"
      >
        <div v-if="!loaded" class="d-flex justify-center">
          <v-btn
            x-large=""
            @click="paypalSelected"
            color="primary"
            rounded
            width="300"
            class="font-weight-bold"
            >Pagar con PayPal <v-icon>mdi-lock-check</v-icon></v-btn
          >
        </div>
      </div>
    </v-container>
    <v-container v-else
      ><v-card elevation="0" color="transparent">
        <v-card-title
          style="word-break:normal"
          :class="
            $vuetify.breakpoint.mdAndUp
              ? 'display-1 text-uppercase white--text text-center font-weight-bold d-flex justify-center'
              : ' text-uppercase white--text text-center  d-flex justify-center'
          "
          >gracias por tu compra
        </v-card-title>
        <v-card-text class="d-flex justify-center align-center flex-column">
          <!--         <v-img
            width="100"
            height="auto"
            class="mx-auto my-4"
            src="../../assets/img/check.svg"
          ></v-img>
 -->
          <v-card
            :width="$vuetify.breakpoint.mdAndUp ? '100%' : 300"
            class="my-12"
          >
            <v-card-title
              style="word-break:normal"
              :class="
                $vuetify.breakpoint.mdAndUp
                  ? 'headline primary--text font-weight-bold'
                  : ' primary--text font-weight-bold'
              "
              >RESUMEN DE COMPRA</v-card-title
            >
            <v-card-text class="title">
              <span class="font-weight-bold">FECHA:</span>
              {{ order.paypal.create_time | formatDate }}<br />

              <span class="font-weight-bold"> ID DE ORDEN:</span>
              {{ order.uid }}
              <span class="font-weight-bold">PRODUCTO:</span>
              <ul>
                <li
                  style="word-break:normal"
                  v-for="(item, i) in order.productos"
                  :key="i"
                >
                  {{ item.producto.productName }}(X
                  {{ item.quanty }} unidad)<br />
                  Color:
                  <v-icon :color="item.color.hex">mdi-circle</v-icon><br />
                  Talla:
                  {{ item.size.name }}
                </li>
              </ul>

              <span class="font-weight-bold">TOTAL:</span>
              {{ order.total | formatNumber }}
              <br />

              <span class="font-weight-bold"> Tipo de Envio: </span><br />
              {{ order.costoDeEnvio.text }}
              {{
                new Intl.NumberFormat('es-CR', {
                  style: 'currency',
                  currency: 'CRC',
                }).format(order.costoDeEnvio.value)
              }}<br />
              <span class="font-weight-bold"> Dirección de Envio: </span><br />
              {{ order.address }}<br />
              <span class="font-weight-bold"> Dirección de Paypal:</span
              ><br />{{
                order.paypal.purchase_units[0].shipping.address.address_line_1
              }},
              {{
                order.paypal.purchase_units[0].shipping.address.admin_area_1
              }},
              {{
                order.paypal.purchase_units[0].shipping.address.country_code
              }},
              {{ order.paypal.purchase_units[0].shipping.address.postal_code }}
              <br />
              <span class="font-weight-bold"> Estatus:</span>
              <span class="green--text"> {{ order.paypal.status }}</span
              ><br />
              <span class="font-weight-bold">
                ID de Transacción de PayPal:</span
              >
              {{ order.paypal.id }}<br />
              <span class="font-weight-bold" v-if="order.tracking">
                Tracking:</span
              >
              {{ order.tracking }}
              <v-spacer></v-spacer><br /><br />
              <span class="caption font-weight-bold font-italic"
                >Si desea factura electrónica, por favor solicitela a traves del
                correo electronico asesoria@newskincr.com</span
              >
            </v-card-text>
          </v-card>
        </v-card-text>
      </v-card></v-container
    >
  </div>
</template>

<script>
import { db } from '@/api/firebase.js';
// import image from "../assets/lamp.png"

export default {
  name: 'PayPal',

  data: function() {
    return {
      dialog: false,
      loaded: false,
      paidFor: false,
      product: {
        price: 777.77,
        description: 'leg lamp from that one movie',
        img: './assets/lamp.jpg',
      },
      order: [],
    };
  },
  computed: {
    isCompleted() {
      if (this.order.paypal) {
        if (
          this.order.paypal.status === 'COMPLETED' ||
          this.order.paypal.status === 'ENVIADO'
        ) {
          return true;
        } else return false;
      } else return false;
    },
  },
  firestore() {
    return {
      order: db.collection('ordenes').doc(this.$route.params.id),
    };
  },
  mounted() {},
  methods: {
    paypalSelected() {
      const script = document.createElement('script');
      script.src =
        'https://www.paypal.com/sdk/js?client-id=AVZOBWw51nedygBAyHvFujhA0Du4LUTPBUqxZ5BzEz7NQdcb28N7UvcN_0zybHvcKPzDW1IiXf_Ai2YV';
      script.addEventListener('load', this.setLoaded);
      document.body.appendChild(script);
    },
    async setLoaded() {
      this.loaded = true;

      const data = await fetch(
        'https://api.currencyfreaks.com/latest?apikey=0ec7e8eb6c194dbfa9a021f2132b3489&symbols=CRC',
        { method: 'GET' }
      );
      const response = await data.json();

      const { CRC } = response.rates;
      this.order.total = (this.order.total / CRC).toFixed(2);

      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: this.order.uid,
                  amount: {
                    currency_code: 'USD',
                    value: this.order.total,
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            db.collection('ordenes')
              .doc(this.$route.params.id)
              .update({
                paypal: order,
              })
              .then(() => {
                this.dialog = true;
              });
          },
          /*           onCancel: function(data) {
            console.log(data);
          } */
        })
        .render(this.$refs.paypal);
    },
  },
};
</script>
