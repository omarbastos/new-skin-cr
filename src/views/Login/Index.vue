<template>
  <v-container fluid class="d-flex justify-center align-center">
    <v-row style="height:100%" align="center" justify="center">
      <v-col
        cols="12"
        sm="12"
        md="10"
        class="d-flex justify-center align-center"
      >
        <v-card style="border-radius:18px" class="elevation-24" min-width="300">
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
              <div class="headline font-weight-bold black--text  text-center">
                INICIAR SESIÓN
              </div>
              <div class="mt-2 mb-4 subtitle-1 black--text text-center">
                ¡Bienvenido de vuelta!
              </div>
              <v-form dark ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  label="Correo Electrónico"
                  name="email"
                  v-model="loginForm.email"
                  prepend-inner-icon="mdi-account-outline"
                  type="email"
                  :rules="emailRules"
                />
                <v-text-field
                  id="password"
                  label="Contraseña"
                  name="password"
                  v-model="loginForm.password"
                  prepend-inner-icon="mdi-lock"
                  type="password"
                  :rules="passwordRules"
                />
                <div class="d-flex justify-end">
                  <v-btn @click="dialog = true" text>
                    <div class="caption d-flex justify-end">
                      ¿Olvidaste tu contraseña?
                    </div></v-btn
                  >
                </div>

                <div class="mt-4 d-flex justify-end">
                  <v-btn
                    style="border-radius:8px"
                    block
                    :disabled="!valid"
                    @click="onSubmit"
                    color="primary"
                    >Iniciar Sesión
                  </v-btn>
                </div>
                <div class="flechas my-6">Ó</div>
              </v-form>
              <div class="d-flex justify-center align-center">
                <v-btn fab class="mr-4" @click="facebook"
                  ><v-icon>$Facebook</v-icon></v-btn
                >
                <v-btn fab @click="google"><v-icon>$Google</v-icon></v-btn>
              </div>
              <div class="mt-4 d-flex justify-center align-center">
                ¿No tienes una cuenta?
                <v-spacer></v-spacer>
                <v-btn x-large text to="/register">
                  <span class="font-weight-bold">REGISTRATE</span>
                </v-btn>
              </div>
            </v-card-text>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-overlay opacity="1" color="primary" :value="isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-dialog v-model="dialog" width="500">
      <v-card dark>
        <v-img src="../../assets/img/forgot.svg">
          <v-container
            style="height:100%"
            class="d-flex justify-center align-center flex-column"
          >
            <v-card-title
              style="word-break:normal"
              class="d-flex justify-center text-center headline lighten-2 text-uppercase"
              primary-title
            >
              recuperar contraseña
            </v-card-title>

            <v-card-text class="text-center ">
              Introduce tu nombre de usuario o correo electronico para recuperar
              tu contraseña. <br />
              Recibirás un correo con instrucciones.
              <br />
              <br />
              <v-text-field
                outlined=""
                rounded=""
                filled=""
                v-model="forgot.email"
                label="Correo Electronico"
                prepend-inner-icon="mdi-account"
              ></v-text-field>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn x-large="" color="red" @click="fogorPassword">
                RECUPERAR CONTRASEÑA
              </v-btn>
              <v-spacer></v-spacer> </v-card-actions
          ></v-container>
        </v-img>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  props: {
    source: String
  },
  data: () => ({
    dialog: false,
    isLoading: false,
    forgot: {},
    valid: false,
    emailRules: [
      v => !!v || "El E-mail es requerido",
      v => /.+@.+\..+/.test(v) || "E-mail debe ser valido"
    ],
    passwordRules: [
      v => !!v || "La contraseña es requerida",
      v =>
        (v && v.length >= 8) ||
        "La longitud de la contraseña debe ser al menos 8 caracteres"
    ],
    backgroundLoading: "C24615",
    password: null,
    loginForm: {},
    errors: []
  }),
  created() {},
  methods: {
    fogorPassword() {
      this.isLoading = true;
      this.$store
        .dispatch("auth/FORGOT", this.forgot)
        .then(() => {
          this.dialog = false;
          this.isLoading = false;
        })

        .catch(e => {
          console.error(e);

          this.dialog = false;
          this.isLoading = false;
        });
    },
    facebook() {
      this.isLoading = true;
      this.$store
        .dispatch("auth/FACEBOOK")
        .then(data => {
          // console.log(data);
          this.uid = data;
          this.$store.dispatch("auth/bindUser", data).then(() => {
            this.isLoading = false;
            this.$router.push({ path: "/" });
          });
        })
        .catch(err => {
          this.isLoading = false;
          this.errors = [err.message];
        });
    },
    google() {
      this.isLoading = true;
      this.$store
        .dispatch("auth/GOOGLE")
        .then(data => {
          this.uid = data;
          this.$store.dispatch("auth/bindUser", data).then(() => {
            this.isLoading = false;
            this.$router.push({ path: "/" });
          });
        })
        .catch(err => {
          this.isLoading = false;
          this.errors = [err.message];
        });
    },
    onSubmit(ev) {
      ev.preventDefault();
      if (this.$refs.form.validate()) {
        this.isLoading = true;

        this.loginForm.email = this.loginForm.email.toLowerCase();
        this.$store
          .dispatch("auth/SIGN_IN", this.loginForm)
          .then(data => {
            this.uid = data.user.uid;
            this.$store.dispatch("auth/bindUser", data.user.uid).then(() => {
              this.isLoading = false;
              this.$router.push({ path: "/" });
            });
          })
          .catch(err => {
            this.isLoading = false;
            this.errors = [err.message];
          });
      }
    }
  }
};
</script>

<style>
.blue-background {
  background: url("../../assets/img/blue-background.svg");
  background-position: center center;
  background-size: cover;
}

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
.blue-bg {
  background: linear-gradient(
    90deg,
    rgba(0, 198, 251, 0.6) 0%,
    rgba(0, 91, 234, 0.6) 100%
  );
  border-radius: 10px;
}
</style>
