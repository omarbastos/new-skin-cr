<template>
  <v-container fluid class="d-flex justify-center align-center">
    <v-row style="height:100%" align="center" justify="center">
      <v-col
        cols="12"
        sm="12"
        md="10"
        class="d-flex justify-center align-center flex-column"
      >
        <div
          class="display-1 font-weight-bold white--text  text-center"
          v-text="'Bienvenido'"
        ></div>
        <div
          class="mt-2 mb-7 subtitle-1 white--text text-center"
          v-text="'Registro de NewSkinCr'"
        ></div>
        <v-card style="border-radius:10px" class="elevation-24" min-width="300">
          <v-container>
            <v-card v-if="errors && errors.length">
              <v-card-text
                class="red--text"
                v-for="(err, index) of errors"
                :key="index"
                >{{ err }}</v-card-text
              >
            </v-card>
            <v-card-text>
              <v-form dark ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  label="Correo Electrónico"
                  name="email"
                  v-model="form.email"
                  type="email"
                  :rules="emailRules"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="accent">mdi-at</v-icon></template
                  >
                </v-text-field>
                <v-text-field
                  label="Nombre"
                  name="firstName"
                  v-model="form.firstName"
                  type="text"
                  :rules="[rules.required]"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="accent"
                      >mdi-account-question-outline</v-icon
                    ></template
                  >
                </v-text-field>
                <v-text-field
                  label="Apellido"
                  name="lastName"
                  v-model="form.lastName"
                  type="text"
                  :rules="[rules.required]"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="accent"
                      >mdi-account-question-outline</v-icon
                    ></template
                  >
                </v-text-field>
                <v-text-field
                  id="password"
                  label="Contraseña"
                  name="password"
                  v-model="form.password"
                  type="password"
                  :rules="[rules.required]"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="accent">mdi-lock-outline</v-icon></template
                  ></v-text-field
                >
                <v-text-field
                  id="rePassword"
                  label="Confirmar Contraseña"
                  name="rePassword"
                  v-model="rePassword"
                  type="password"
                  :rules="passwordRules"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="accent">mdi-lock-outline</v-icon></template
                  ></v-text-field
                >
                <v-checkbox
                  required
                  :rules="[v => !!v || 'Obligatorio']"
                  dense
                  v-model="terms"
                >
                  <template v-slot:label>
                    <div>
                      Yo acepto los
                      <a
                        target="_blank"
                        href="https://carwallet.io/terms"
                        @click.stop
                      >
                        Términos y Condiciones
                      </a>
                    </div>
                  </template>
                </v-checkbox>

                <div class="mt-8 d-flex justify-end">
                  <v-btn
                    rounded
                    block
                    x-large=""
                    :disabled="!valid"
                    @click="onSubmit"
                    color="primary"
                    v-text="'Registrarse'"
                  >
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-container>
        </v-card>
        <div dark class="mt-4 white--text d-flex justify-center align-center">
          Ya tengo una cuenta
          <v-spacer></v-spacer>
          <v-btn dark x-large text to="/login">
            <span class="font-weight-bold" v-text="'Iniciar Sesion'"></span>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-overlay opacity="1" color="primary" :value="isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    valid: false,
    privacy: false,
    cookie: false,
    terms: false,
    emailRules: [
      v => !!v || "Obligatorioo",
      v => /.+@.+\..+/.test(v) || "Invalid Email"
    ],
    passwordRules: [
      v => !!v || "Obligatorioo",
      v => (v && v.length >= 8) || "Passwords must match"
    ],
    rules: {
      required: value => !!value || "Obligatorio",
      min: v => v.length >= 6 || "Min 6 characters"
    },
    backgroundLoading: "C24615",
    password: null,
    form: {},
    rePassword: "",
    forgotPassword: {},
    errors: [],
    isLoading: false
  }),
  computed: {
    passwordConfirmationRule() {
      return () =>
        this.form.password === this.rePassword ? false : "Password must match";
    }
  },
  created() {},
  methods: {
    onSubmit(ev) {
      ev.preventDefault();
      if (this.$refs.form.validate()) {
        this.isLoading = true;
        this.$store
          .dispatch("auth/CREAR_USUARIO", this.form)
          .then(data => {
            this.uid = data;
            this.$store.dispatch("auth/bindUser", data).then(() => {
              this.$router.push({ path: "/" });
            });
          })
          .catch(err => {
            this.errors = [err.message];
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    }
  }
};
</script>

<style>
.flechas {
  overflow: hidden;
  text-align: center;

  color: #000000;
}

.flechas:before,
.flechas:after {
  background-color: #000000;
  opacity: 0.23;
  content: "";
  display: inline-block;
  height: 2px;
  position: relative;
  vertical-align: middle;
  width: 25%;
}

.flechas:before {
  right: 0.5em;
  margin-left: -50%;
}

.flechas:after {
  left: 0.5em;
  margin-right: -50%;
}
</style>
