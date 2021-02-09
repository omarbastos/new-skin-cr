<template>
  <v-container v-if="order && order.user">
    <v-card :width="$vuetify.breakpoint.mdAndUp ? '100%' : 300" class="my-12">
      <v-card-title
        style="word-break:normal"
        :class="
          $vuetify.breakpoint.mdAndUp
            ? 'headline primary--text font-weight-bold'
            : ' primary--text font-weight-bold'
        "
        >RESUMEN DE ORDEN</v-card-title
      >
      <v-card-text class="title">
        <span class="font-weight-bold ">USUARIO: </span>

        <router-link to="/admin/user/:id">
          <span v-if="order.user.firstName" class="text-capitalize">{{
            order.user.firstName + ' ' + order.user.lastName
          }}</span></router-link
        >
        <br />
        <span class="font-weight-bold ">Total: </span
        >{{ order.total | formatNumber }}
        <br />
        <span class="font-weight-bold ">FECHA:</span>
        <span class="text-capitalize">
          {{ order.createdAt.toDate() | formatDate }}</span
        >
        <br />

        <span class="font-weight-bold"> ID DE ORDEN:</span>
        {{ order.uid }}<br />
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
        <span class="font-weight-bold">PRODUCTO:</span>
        <ul>
          <li
            style="word-break:normal"
            v-for="(item, i) in order.productos"
            :key="i"
          >
            {{ item.producto.productName }}(X {{ item.quanty }} unidad)<br />
            Color:
            <v-icon :color="item.color.hex">mdi-circle</v-icon><br />
            Talla:
            {{ item.size.name }}
          </li>
        </ul>
        <template v-if="order.paypal">
          <v-divider class="my-12"></v-divider>
          <span class="font-weight-bold">DATOS PROVENIENTES DE PAYPAL:</span>
          <br />

          <span class="font-weight-bold"> Dirección de Envío:</span><br />{{
            order.paypal.purchase_units[0].shipping.address.address_line_1
          }},
          {{ order.paypal.purchase_units[0].shipping.address.admin_area_1 }},
          {{ order.paypal.purchase_units[0].shipping.address.country_code }},
          {{ order.paypal.purchase_units[0].shipping.address.postal_code }}
          <br />
          <span class="font-weight-bold"> Estatus:</span>
          <span class="green--text"> {{ order.paypal.status }}</span
          ><br />
          <span class="font-weight-bold"> ID de Transacción de PayPal:</span>
          {{ order.paypal.id }}<br />
          <span class="font-weight-bold" v-if="order.tracking"> Tracking:</span>
          {{ order.tracking }}
        </template>
      </v-card-text>
      <v-card-actions class="d-flex justify-center align-center">
        <v-btn @click="deleteOrder" :disabled="!!order.paypal" color="error"
          >Eliminar Orden</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          @click="enviar"
          color="success"
          :disabled="!order.paypal || order.tracking"
          >Marcar como Enviado</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title style="word-break:normal" class="headline"
          >Información de seguimiento</v-card-title
        >
        <v-card-text>
          <v-text-field label="Tracking" v-model="tracking"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn :disabled="!tracking" color="primary" @click="updateFirebase"
            >Actualizar Info</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { db } from '@/api/firebase.js';
export default {
  data: () => ({
    order: {},
    dialog: false,
    tracking: null,
  }),
  firestore() {
    return {
      order: db.collection('ordenes').doc(this.$route.params.id),
    };
  },
  methods: {
    updateFirebase() {
      db.collection('ordenes')
        .doc(this.order.uid)
        .update({
          tracking: this.tracking,
          'paypal.status': 'ENVIADO',
        })
        .then(() => (this.dialog = false));
    },
    async deleteOrder() {
      const res = await this.$confirm('¿Estas seguro de eliminar esta orden?', {
        buttonTrueText: 'Si, estoy seguro',
        buttonFalseText: 'No, quiero volver',
        color: '#19A7F6',
        title: 'Confirmar Compra',
        persistent: true,
      });
      if (res) {
        db.collection('ordenes')
          .doc(this.order.uid)
          .update({
            disabled: true,
          });
      }
    },
    async enviar() {
      const res = await this.$confirm(
        '¿Estas seguro de cambiar el estatus a ENVIADO de esta orden?',
        {
          buttonTrueText: 'Si, estoy seguro',
          buttonFalseText: 'No, quiero volver',
          color: '#19A7F6',
          title: 'Confirmar Compra',
          persistent: true,
        }
      );
      if (res) {
        this.dialog = true;
      }
    },
  },
};
</script>

<style></style>
