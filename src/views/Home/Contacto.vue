<template>
  <v-container fluid class="mt-12">
    <v-snackbar :color="colorSnack" v-model="snackbar">
      {{ responseText }}
      <v-btn color="white" @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-container style="margin-bottom:300px">
      <v-row justify="center" align="center">
        <v-col cols="12" md="8" justify="center" align="center">
          <v-card color="transparent" elevation="0">
            <v-card-title
              style="word-break:normal"
              :class="
                $vuetify.breakpoint.mdAndUp
                  ? 'display-1 text-uppercase font-weight-bold'
                  : 'headline my-2 text-uppercase font-weight-bold'
              "
              >Preguntanos lo que quieras</v-card-title
            >
            <v-card-subtitle
              :class="
                $vuetify.breakpoint.mdAndUp
                  ? 'headline text-uppercase font-weight-bold'
                  : 'title my-2 text-uppercase font-weight-bold'
              "
              >Estamos para atenderte</v-card-subtitle
            >
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="fields.firstname"
                    label="Nombre"
                    :rules="requireRules"
                  ></v-text-field
                ></v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="fields.lastname"
                    label="Apellido"
                    :rules="requireRules"
                  ></v-text-field
                ></v-col>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="fields.email"
                    label="Correo Electrónico"
                    :rules="requireRules"
                  ></v-text-field
                ></v-col>
                <v-col cols="12" md="12">
                  <v-textarea
                    v-model="fields.message"
                    label="Mensaje"
                    :rules="requireRules"
                  ></v-textarea>
                </v-col>
              </v-row>

              <v-card-actions class="pb-4">
                <v-btn
                  block
                  x-large
                  class="mx-auto text-uppercase"
                  @click="submit"
                  color="primary"
                  >Enviar
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-overlay opacity="1" color="primary" :value="isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    valid: true,
    requireRules: [v => !!v || "Este campo es obligatorio"],
    snackbar: false,
    responseText: false,
    colorSnack: "primary",
    isLoading: false,
    fields: {},
    ip: null,
    hutk: null
  }),
  mounted() {
    this.getIp();
  },

  methods: {
    getIp() {
      fetch("https://api.ipify.org?format=json")
        .then(x => x.json())
        .then(({ ip }) => {
          this.ip = ip;
        });
      /*eslint-disable */
      this.hutk = document.cookie.replace(
        /(?:(?:^|.*;\s*)hubspotutk\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      /*eslint-enable */
    },

    submit() {
      if (this.$refs.form.validate()) {
        this.isLoading = true;
        var url =
          "https://api.hsforms.com/submissions/v3/integration/submit/7999895/0e5f51e3-88db-405c-81c3-ec1105a1f479";

        // Example request JSON:
        var data = {
          fields: [
            {
              name: "firstname",
              value: this.fields.firstname
            },
            {
              name: "lastname",
              value: this.fields.lastname
            },
            {
              name: "email",
              value: this.fields.email
            },
            {
              name: "message",
              value: this.fields.message
            }
          ],
          context: {
            hutk: this.hutk, // include this parameter and set it to the hubspotutk cookie value to enable cookie tracking on your submission
            pageUri: "newskincr.com",
            pageName: "Landing Page",
            ipAddress: this.ip
          }
        };

        var final_data = data;
        axios
          .post(url, final_data)
          .then(res => {
            this.responseText = res.data.inlineMessage;
            this.snackbar = true;
            this.colorSnack = "primary";
            this.$refs.form.reset();
          })
          .catch(() => {
            this.responseText = "Hubo un error con los campos suministrados";
            this.snackbar = true;
            this.colorSnack = "red";
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    }
  }
};
</script>

<style></style>
