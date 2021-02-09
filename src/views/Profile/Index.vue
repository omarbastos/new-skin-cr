<template>
  <v-container mx-0 pa-0 fluid class="mt-12">
    <v-snackbar dark v-model="snackbar">
      Su perfil ha sido actualizado
      <v-btn color="primary" @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>

    <v-row class="ma-0 pa-0" justify="center" align="center">
      <v-col class="ma-0 pa-0" cols="12" md="8" justify="center" align="center">
        <v-sheet v-if="!user" color="lighten-4" class="px-3 pt-3 pb-3">
          <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
        </v-sheet>

        <v-card v-else class="elevation-12 mt-12">
          <v-card-title
            class="text-uppercase primary white--text d-flex font-weight-bold justify-center text-center"
            >PERFIL DE USUARIO</v-card-title
          >

          <v-form>
            <v-card-text>
              <v-container>
                <v-text-field
                  outlined
                  prepend-inner-icon="mdi-account"
                  v-model="user.firstName"
                  label="Nombre(s)"
                  :rules="[rules.required]"
                ></v-text-field>
                <v-text-field
                  outlined
                  prepend-inner-icon="mdi-account-outline"
                  v-model="user.lastName"
                  label="Apellido(s)"
                  :rules="[rules.required]"
                ></v-text-field>

                <vue-tel-input
                  class="mb-8 py-2"
                  required
                  placeholder="Whatsapp o Teléfono"
                  :defaultCountry="user.country"
                  v-model="user.phone"
                ></vue-tel-input>
              </v-container>
              <v-card-actions class="pb-4">
                <v-btn
                  x-large
                  class="mx-auto text-uppercase"
                  @click="onSubmit"
                  color="primary"
                >
                  <v-icon>mdi-update</v-icon> ACTUALIZAR
                </v-btn>
              </v-card-actions>
            </v-card-text>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState } from "vuex";
import { db } from "@/api/firebase.js";
export default {
  computed: {
    ...mapState("auth", {
      user: "user"
    })
  },
  data: () => ({
    errors: [],
    show1: false,
    show2: false,
    rules: {
      required: value => !!value || "Required.",
      min: v => v.length >= 6 || "Min 6 characters"
    },
    rePassword: "",
    snackbar: false,

    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    countries: [
      { name: "Andorra", code: "AD" },

      { name: "Argentina", code: "AR" },

      { name: "Aruba", code: "AW" },
      { name: "Australia", code: "AU" },
      { name: "Austria", code: "AT" },

      { name: "Belgium", code: "BE" },
      { name: "Belize", code: "BZ" },

      { name: "Bolivia", code: "BO" },

      { name: "Brazil", code: "BR" },

      { name: "Bulgaria", code: "BG" },

      { name: "Canada", code: "CA" },

      { name: "Chile", code: "CL" },
      { name: "China", code: "CN" },
      { name: "Colombia", code: "CO" },

      { name: "Costa Rica", code: "CR" },
      { name: "Czech Republic", code: "CZ" },
      { name: "Denmark", code: "DK" },
      { name: "Dominica", code: "DM" },
      { name: "Dominican Republic", code: "DO" },
      { name: "Ecuador", code: "EC" },
      { name: "Egypt", code: "EG" },
      { name: "El Salvador", code: "SV" },
      { name: "Equatorial Guinea", code: "GQ" },
      { name: "Finland", code: "FI" },
      { name: "France", code: "FR" },
      { name: "Georgia", code: "GE" },
      { name: "Germany", code: "DE" },
      { name: "Greece", code: "GR" },
      { name: "Greenland", code: "GL" },
      { name: "Grenada", code: "GD" },
      { name: "Guadeloupe", code: "GP" },
      { name: "Guam", code: "GU" },
      { name: "Guatemala", code: "GT" },
      { name: "Guernsey", code: "GG" },
      { name: "Guinea", code: "GN" },
      { name: "Haiti", code: "HT" },
      { name: "Honduras", code: "HN" },
      { name: "Hong Kong", code: "HK" },
      { name: "Hungary", code: "HU" },
      { name: "Iceland", code: "IS" },
      { name: "India", code: "IN" },
      { name: "Indonesia", code: "ID" },
      { name: "Iran, Islamic Republic Of", code: "IR" },
      { name: "Iraq", code: "IQ" },
      { name: "Ireland", code: "IE" },
      { name: "Italy", code: "IT" },
      { name: "Jamaica", code: "JM" },
      { name: "Japan", code: "JP" },
      { name: "Malta", code: "MT" },
      { name: "Mexico", code: "MX" },
      { name: "Netherlands", code: "NL" },
      { name: "Netherlands Antilles", code: "AN" },
      { name: "New Zealand", code: "NZ" },
      { name: "Nicaragua", code: "NI" },
      { name: "Niue", code: "NU" },
      { name: "Norway", code: "NO" },
      { name: "Panama", code: "PA" },
      { name: "Paraguay", code: "PY" },
      { name: "Peru", code: "PE" },
      { name: "Philippines", code: "PH" },
      { name: "Poland", code: "PL" },
      { name: "Portugal", code: "PT" },
      { name: "Puerto Rico", code: "PR" },
      { name: "Qatar", code: "QA" },
      { name: "Romania", code: "RO" },
      { name: "Russian Federation", code: "RU" },
      { name: "Saint Helena", code: "SH" },
      { name: "Saint Kitts and Nevis", code: "KN" },
      { name: "Saint Lucia", code: "LC" },
      { name: "Saint Pierre and Miquelon", code: "PM" },
      { name: "Saint Vincent and the Grenadines", code: "VC" },
      { name: "San Marino", code: "SM" },
      { name: "Sao Tome and Principe", code: "ST" },
      { name: "Saudi Arabia", code: "SA" },
      { name: "Serbia", code: "RS" },
      { name: "Sierra Leone", code: "SL" },
      { name: "Singapore", code: "SG" },
      { name: "Slovakia", code: "SK" },
      { name: "Slovenia", code: "SI" },
      { name: "Solomon Islands", code: "SB" },
      { name: "Somalia", code: "SO" },
      { name: "South Africa", code: "ZA" },
      { name: "South Georgia and the South Sandwich Islands", code: "GS" },
      { name: "Spain", code: "ES" },
      { name: "Sri Lanka", code: "LK" },
      { name: "Sudan", code: "SD" },
      { name: "Suriname", code: "SR" },
      { name: "Svalbard and Jan Mayen", code: "SJ" },
      { name: "Swaziland", code: "SZ" },
      { name: "Sweden", code: "SE" },
      { name: "Switzerland", code: "CH" },
      { name: "Taiwan, Province of China", code: "TW" },
      { name: "Thailand", code: "TH" },
      { name: "Trinidad and Tobago", code: "TT" },
      { name: "Tunisia", code: "TN" },
      { name: "Turkey", code: "TR" },
      { name: "Uganda", code: "UG" },
      { name: "Ukraine", code: "UA" },
      { name: "United Arab Emirates", code: "AE" },
      { name: "United Kingdom", code: "GB" },
      { name: "United States", code: "US" },
      { name: "United States Minor Outlying Islands", code: "UM" },
      { name: "Uruguay", code: "UY" },
      { name: "Uzbekistan", code: "UZ" },
      { name: "Vanuatu", code: "VU" },
      { name: "Venezuela", code: "VE" },
      { name: "Viet Nam", code: "VN" },
      { name: "Virgin Islands, British", code: "VG" },
      { name: "Virgin Islands, U.S.", code: "VI" }
    ],
    showAvatarPicker: false
  }),
  methods: {
    onSubmit() {
      db.collection("users")
        .doc(this.user.uid)
        .update(this.user)
        .then(() => {
          this.snackbar = true;
        });
    }
  }
};
</script>

<style></style>
