<template>
  <v-footer
    v-if="routes"
    absolute
    class="footer-img mt-12 font-weight-medium d-flex justify-start align-end"
  >
    <v-row>
      <v-col class="text-center white--text" cols="12" md="5">
        <v-btn color="white" fab class="mx-0">
          <v-icon color="#4267B2" x-large="" class="pa-0 ma-0"
            >mdi-facebook</v-icon
          >
        </v-btn>

        <v-btn color="white" fab class=" mx-2">
          <v-icon color="#E1306C" x-large="" class="pa-0 ma-0"
            >mdi-instagram</v-icon
          >
        </v-btn>
        <v-list-item-group v-if="$vuetify.breakpoint.smAndUp" dark>
          <v-row>
            <v-col>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title> Home</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Destacados</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Catálogo</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Contáctanos</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
        </v-list-item-group>
      </v-col>
      <v-col cols="12" md="4" offset-md="3" class="d-flex align-end">
        <div class="white--text caption">
          NewSkinCr {{ new Date().getFullYear() }} Todos los derechos
          reservados. <br />
          <router-link class="white--text" to="/privacy"
            >Politicas de Privacidad
          </router-link>
        </div>
      </v-col></v-row
    >
  </v-footer>
</template>

<script>
export default {
  data: () => ({}),
  computed: {
    routes() {
      if (
        this.$route.name === 'Admin' ||
        this.$route.name === 'Admin/Products' ||
        this.$route.name === 'Admin/Products/New' ||
        this.$route.name === 'Admin/Category' ||
        this.$route.name === 'Admin/Size' ||
        this.$route.name === 'Admin/Colors'
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>

<style>
.theme--light.v-footer {
  background-color: #ffffff !important;
}
.footer-img {
  padding-top: 200px;
  min-height: 300px;
  height: auto;
  background-color: #ffffff;
  background: url('../../assets/img/footer.svg');
  background-position: center bottom;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
