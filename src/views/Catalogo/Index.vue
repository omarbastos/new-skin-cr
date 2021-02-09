<template>
  <v-content ma-0 pa-0 fluid>
    <div class="d-flex align-center">
      <v-btn class="ma-4" @click="isOpen = !isOpen" fab small color="primary">
        <v-icon dark>{{
          isOpen ? 'mdi-filter-minus' : 'mdi-filter-menu'
        }}</v-icon>
      </v-btn>
      <transition
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        v-on:leave="leave"
        v-bind:css="false"
      >
        <v-navigation-drawer
          width="320"
          fixed
          dark
          src="../../assets/img/navig.svg"
          v-model="isOpen"
        >
          <v-container
            ><v-form dark ref="forma" v-model="valid" lazy-validation>
              <!--      <v-autocomplete
                outlined
                dense
                rounded
                filled
                chips
                small-chips
                label="Talla"
                item-text="name"
                return-object=""
                :items="tallas"
                v-model="form.talla"
              >
              </v-autocomplete>
              <v-autocomplete
                outlined
                dense
                rounded
                filled
                chips
                small-chips
                label="Colores"
                item-text="name"
                return-object=""
                :items="colores"
                v-model="form.color"
              >
              </v-autocomplete> -->
              <v-autocomplete
                outlined
                dense
                rounded
                filled
                chips
                small-chips
                label="Categorias"
                item-text="name"
                item-value="name"
                :items="categorias"
                v-model="form.categoria"
              >
              </v-autocomplete>
              <div class="d-flex justify-center align-center">
                <v-btn
                  style="border-radius:8px"
                  block
                  :disabled="!valid"
                  @click="onSubmit"
                  color="primary"
                  >Filtrar
                </v-btn>
              </div>
            </v-form>
          </v-container></v-navigation-drawer
        >
      </transition>
    </div>
    <v-sheet v-if="!catalogo[0]" color="lighten-4" class="px-3 pt-3 pb-3">
      <v-container>
        <v-row>
          <v-col cols="6" v-for="i in 6" :key="i">
            <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader
          ></v-col>
        </v-row>
      </v-container>
    </v-sheet>
    <v-container v-else style="margin-bottom:100px">
      <h1 class="primary--text font-weight-bold">
        ¡Nuestro Catalogo!
      </h1>
      <v-row transition="fade-transition" appear>
        <v-col
          cols="12"
          md="6"
          sm="6"
          v-for="(item, index) in filteredCatalog.length > 0
            ? filteredCatalog
            : catalogo"
          :key="index"
        >
          <ProductoCard
            class="producto"
            :tasa="tasa"
            :card="item"
          ></ProductoCard>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import axios from 'axios';
import Velocity from 'velocity-animate';
import ProductoCard from '@/components/ProductoCard/Index';
import { db } from '@/api/firebase.js';
export default {
  created() {
    axios
      .get('https://s3.amazonaws.com/dolartoday/data.json')
      .then((response) => {
        this.tasa = response.data.USD.transferencia;
      });
  },
  firestore() {
    return {
      tallas: db.collection('productsSize').orderBy('name'),
      colores: db.collection('colors').orderBy('name'),
      categorias: db.collection('productsCategory').orderBy('name'),
      catalogo: db.collection('catalogo').orderBy('productName'),
    };
  },
  components: {
    ProductoCard,
  },
  data: () => ({
    filteredCatalog: [],
    form: {
      min: 0,
    },
    valid: true,
    colores: [],
    categorias: [],
    catalogo: [],
    tallas: [],
    sucursales: [],
    title: process.env.VUE_APP_TITLE,

    slider: 40,
    range: [-20, 70],
    tasa: null,
    isOpen: false,
  }),
  computed: {
    max() {
      if (this.form) {
        if (this.form.max) {
          return parseInt(this.form.max);
        } else {
          return 10000000;
        }
      } else {
        return 10000000;
      }
    },
    min() {
      if (this.form) {
        if (this.form.min) {
          return parseInt(this.form.min);
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    },
  },
  mounted() {},
  methods: {
    onSubmit(ev) {
      ev.preventDefault();
      if (this.$refs.forma.validate()) {
        this.isLoading = true;
        if (this.form.categoria) {
          this.$bind(
            'filteredCatalog',
            db
              .collection('catalogo')
              .where('productCategory', '==', this.form.categoria)
          );
        } else {
          this.$bind('filteredCatalog', db.collection('catalogo'));
        }

        this.isOpen = false;
      }
    },

    beforeEnter: function(el) {
      el.style.opacity = 0;
      el.style.width = '0em';
    },
    enter: function(el, done) {
      Velocity(
        el,
        { opacity: 1, width: '100%' },
        { duration: 1000, easing: 'easeOutCubic', complete: done }
      );
    },
    leave: function(el, done) {
      Velocity(
        el,
        { opacity: 0, width: '0em' },
        { duration: 500, easing: 'easeInCubic', complete: done }
      );
    },
  },
};
</script>

<style scoped>
img {
  height: 2.5em;
  width: 2.5em;
  border-radius: 50%;
}

.drawer {
  display: flex;

  align-items: center;
  width: 100%;
  height: auto;
  border-radius: 1%;
  background-color: #ffffff;
  box-shadow: 0.08em 0.03em 0.4em #ababab;
  padding-top: 0.7em;
}
</style>
