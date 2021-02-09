<template>
  <v-container>
    <v-snackbar dark v-model="snackbar">
      Su actualización está lista
      <v-btn color="primary" @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-card class=" mt-12 elevation-12" style="border-radius: 24px 4px;">
      <v-card-title class="white--text primary">
        Lista de Productos

        <v-spacer></v-spacer>
        <v-text-field
          dark
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        ref="vDataTable"
        :headers="headers"
        :items="catalogo"
        :items-per-page="5"
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        show-expand
        :loading="catalogo < 1"
        :search="search"
        item-key="productName"
      >
        <template v-slot:item.productImage="{ item }">
          <v-avatar
            v-animate-css.hover="'pulse'"
            class="my-4 mx-auto"
            width="100"
            height="100"
            @click="$router.push('/equipment/' + item.id)"
            style="border-radius:8px"
          >
            <v-img
              aspect-ratio="1"
              contain=""
              :src="
                item.productImage
                  ? item.productImage
                  : require('@/assets/img/Products/preview.png')
              "
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </v-row> </template
            ></v-img>
          </v-avatar>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <!-- we must remove padding, margins and min-height from td -->
          <td colspan="7">Descripción: {{ item.productDescription }}</td>
        </template>
        <template v-slot:item.data-table-expand="props">
          <v-icon
            :class="{
              'v-data-table__expand-icon': true,
              'v-data-table__expand-icon--active':
                props.isExpanded && transitioned[getItemId(props.item)],
            }"
            @click="toggleExpand(props)"
          >
            mdi-chevron-down
          </v-icon>
        </template>
        <template v-slot:item.productColor="{ item }">
          <div class="d-flex justify-center align-center">
            <v-icon
              v-for="(color, index) in item.productColor"
              :key="index"
              :color="color.hex"
              x-small=""
              >mdi-circle</v-icon
            >
          </div>
        </template>
        <template v-slot:item.productSize="{ item }">
          <div class="d-flex justify-center align-center">
            <v-chip
              v-for="(size, index) in item.productSize"
              :key="index"
              color="primary"
              x-small=""
              >{{ size.name }}</v-chip
            >
          </div>
        </template>
        <template v-slot:item.productPrice="{ item }">
          {{ item.productPrice | formatNumber }}
        </template>
        <template v-slot:item.destacados="{ item }">
          <v-switch
            :readonly="!item.destacados && enableToggle"
            @change="setDestacados(item)"
            v-model="item.destacados"
            inset=""
          ></v-switch>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="goToRoute(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
      <v-card-actions class="pb-8 d-flex justify-center">
        <div class="d-flex justify-center">
          <v-btn
            to="/admin/products/new"
            x-large
            rounded=""
            class="mx-auto"
            color="primary"
          >
            <v-icon>mdi-cart-plus</v-icon>
            Nuevo Producto
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { db } from '@/api/firebase.js';
export default {
  data() {
    return {
      search: '',
      snackbar: false,
      expanded: [],
      transitioned: [],
      closeTimeouts: {},
      singleExpand: false,
      headers: [
        {
          text: 'Imagen Referencial',
          align: 'center',
          sortable: false,
          value: 'productImage',
        },
        {
          text: 'Nombre del Producto',
          align: 'center',
          sortable: true,
          value: 'productName',
        },
        {
          text: 'Destacado',
          align: 'center',
          sortable: true,
          value: 'destacados',
        },
        {
          text: 'Inventario',
          align: 'center',
          sortable: true,
          value: 'productInventory',
        },
        { text: 'Precio del Producto', align: 'center', value: 'productPrice' },
        /*  {
          text: "Descripcion del Producto",
          align: "center",
          value: "productDescription"
        }, */ {
          text: 'Tamaño',
          align: 'center',
          value: 'productSize',
        },
        { text: 'Categoria', align: 'center', value: 'productCategory' },
        { text: 'Codigo', align: 'center', value: 'productCodigo' },
        { text: 'Colors', align: 'center', value: 'productColor' },
        { text: 'Actions', align: 'center', value: 'actions', sortable: false },
      ],
      catalogo: [],
    };
  },
  firestore() {
    return {
      catalogo: db.collection('catalogo').orderBy('productName'),
    };
  },
  computed: {
    enableToggle() {
      if (this.catalogo.filter((v) => v.destacados).length >= 3) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    singleExpand(v) {
      if (!v) return;
      // Single expand enabled. Hide all but the first expanded item
      this.expanded.forEach((item, i) => {
        if (i > 0) this.closeExpand(item);
      });
    },
  },
  filters: {
    fixedValue: function(value) {
      if (!value) return '';
      value = parseFloat(value).toFixed(2);
      return value;
    },
  },
  methods: {
    goToRoute(item) {
      this.$router.push({
        name: 'Admin/Products/Edit',
        params: {
          id: item.uid,
        },
      });
    },
    setDestacados(item) {
      db.collection('catalogo')
        .doc(item.uid)
        .update({ destacados: item.destacados });
    },
    deleteItem(item) {
      confirm('Are you sure you want to delete this item?') &&
        db
          .collection('catalogo')
          .doc(item.uid)
          .delete()
          .then(() => {
            this.snackbar = true;
          });
    },
    getItemId(item) {
      return item.name; // Must be uid of record (would be nice if v-data-table exposed a "getItemKey" method)
    },
    toggleExpand(props) {
      const item = props.item;
      const id = this.getItemId(item);
      if (props.isExpanded && this.transitioned[id]) {
        // If we're expanded and not in the process of closing, close
        this.closeExpand(item);
      } else {
        // If we're closed or in the process of closing, expand
        // Stop us from closing if a close transition was started
        clearTimeout(this.closeTimeouts[id]);
        // Tell v-data-table to add the expansion content for the item
        props.expand(true);
        // Show expansion content with transition animation after it's had time to get added to the DOM
        this.$nextTick(() => this.$set(this.transitioned, id, true));
        // Hide all other expanded items if single-expand
        if (this.singleExpand)
          this.$nextTick(() =>
            this.expanded.forEach((i) => i !== item && this.closeExpand(i))
          );
      }
    },
    closeExpand(item) {
      const id = this.getItemId(item);
      // Mark that this item is in the process of closing
      this.$set(this.transitioned, id, false);
      // Remove expansion content from DOM after transition animation has had enough time to finish
      this.closeTimeouts[id] = setTimeout(
        () => this.$refs.vDataTable.expand(item, false),
        600
      );
    },
  },
};
</script>

<style></style>
