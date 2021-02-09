<template>
  <v-card class="mt-4 black elevation-12 mx-auto" style="border-radius:18px">
    <v-sheet
      style="border-radius:9px"
      class="v-sheet--offset mx-auto"
      color="white"
      elevation="12"
      max-width="calc(100% - 32px)"
    >
      <vue-apex-charts
        type="bar"
        :options="options"
        :series="Ventas"
      ></vue-apex-charts>
    </v-sheet>
    <v-card-text dark class="pt-0">
      <div class="headline white--text font-weight-light mb-2">
        Ventas
      </div>
      <div class="title font-weight-light white--text">
        Total de Colones en Ordenes: ₡
        {{ value | formatNumber }}
      </div>
      <div class="title font-weight-light green--text">
        Ventas Exitosas: ₡
        {{ ventasExitosas | formatNumber }}
      </div>
      <div class="title font-weight-light red--text">
        Ventas Pendientes: ₡
        {{ (value - ventasExitosas) | formatNumber }}
      </div>

      <v-divider dark class="my-2"></v-divider>
      <v-icon dark class="mr-2" small>
        mdi-clock
      </v-icon>
      <span v-if="lastVenta" class="caption white--text font-weight-light">
        Ultima venta {{ lastVenta }}</span
      ></v-card-text
    >

    <!--    <v-sheet
      class="v-sheet--offset mx-auto"
      color="cyan"
      elevation="12"
      max-width="calc(100% - 32px)"
    >
        <v-sparkline
        :labels="labels"
        :value="value"
        color="white"
        line-width="2"
        padding="16"
      ></v-sparkline>
     
    </v-sheet>
    <v-card-title class="title primary text-center pt-0 font-weight-bold">
      Estadisticas de Ventas
    </v-card-title>
    <v-card-text class="pt-0">
      <div class="title font-weight-light mb-2">Ingresos</div>
      <div class="subheading font-weight-light grey--text">
        Total ₡
        {{ totalVentas }} 
      </div>
      <v-divider class="my-2"></v-divider>
      <v-icon class="mr-2" small>
        mdi-clock
      </v-icon>
      <span class="caption grey--text font-weight-light"
        ><{{
        ultimaVentaHace
      }} </span
      >
    </v-card-text> -->
  </v-card>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

const _ = require("lodash");
import { db } from "@/api/firebase.js";
import moment from "moment";
export default {
  firestore() {
    return {
      ordenes: db.collection("ordenes")
    };
  },
  data: () => ({
    ordenes: []
  }),
  components: {
    VueApexCharts
  },
  computed: {
    Ventas() {
      let success = this.ordenes.filter(item => item.paypal !== undefined);

      const dia = item => moment(item.createdAt.toDate()).format("MM/DD");
      let arrayAux = _.map(_.groupBy(success, dia), (o, idx) => {
        return {
          date: idx,
          ordenes: o.length,
          ventas: this.$options.filters.formatNumber(_.sumBy(o, "total"))
        };
      });
      let finishArray = _.orderBy(arrayAux, "date", "asc");

      let newArray = _.map(_.groupBy(this.ordenes, dia), (o, idx) => {
        return {
          date: idx,
          ordenes: o.length,
          ventas: this.$options.filters.formatNumber(_.sumBy(o, "total"))
        };
      });
      let mapedArray = _.orderBy(newArray, "date", "asc");
      let ventas = mapedArray.map(function(obj) {
        return [obj.date, obj.ventas];
      });
      let exitosas = finishArray.map(function(obj) {
        return [obj.date, obj.ventas];
      });

      return [
        { name: "Total de Ordenes", data: ventas },
        { name: "Total de Ordenes Exitosas", data: exitosas }
      ];
    },
    ventasExitosas() {
      /*       const dia = item => moment(item.createdAt.toDate()).format("DD/MM/YY");
      const result = _.groupBy(this.ordenes, dia);
      return result; */
      let success = this.ordenes.filter(item => item.paypal !== undefined);
      const reducer = (acumulator, item) => {
        return acumulator + item.total;
      };
      const total = success.reduce(reducer, 0);
      return total;
    },
    options() {
      return {
        chart: {
          id: "Metax-app"
        },

        xaxis: {
          type: "datetime",
          label: {
            format: "dd/MM"
          }
        },

        theme: {
          mode: "light",
          palette: "palette1"
        },
        noData: {
          text: "There is no data for this API",
          align: "center",
          verticalAlign: "middle",
          offsetX: 0,
          offsetY: 0,
          style: {
            color: undefined,
            fontSize: "14px",
            fontFamily: undefined
          }
        }
      };
    },
    value() {
      /*       const dia = item => moment(item.createdAt.toDate()).format("DD/MM/YY");
      const result = _.groupBy(this.ordenes, dia);
      return result; */
      const reducer = (acumulator, item) => {
        return acumulator + item.total;
      };
      const total = this.ordenes.reduce(reducer, 0);
      return total;
    },
    lastVenta() {
      let foo = _.orderBy(this.ordenes, "createdAt", "asc");
      let last = [...foo].pop();
      moment.locale("es");
      let result;
      if (last) {
        result = moment(last.createdAt.toDate())
          .startOf("day")
          .fromNow();
      } else {
        result = "Error al Conectar";
      }

      return result;
    }
  }
};
</script>

<style>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>
