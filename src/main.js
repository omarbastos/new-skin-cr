import Vue from "vue";
import App from "./App.vue";

import store from "./store";
import router from "./router";
import vuetify from "./plugins/vuetify";
import "@/api/firebase.js";
import { auth } from "@/api/firebase.js";
import VuetifyConfirm from "vuetify-confirm";
Vue.use(VuetifyConfirm, { vuetify });
import { firestorePlugin } from "vuefire";
import VuetifyDialog from "vuetify-dialog";
import "vuetify-dialog/dist/vuetify-dialog.css";
Vue.use(VuetifyDialog, {
  context: {
    vuetify
  }
});
Vue.use(firestorePlugin);

// vuemask
import VueTheMask from "vue-the-mask";
Vue.use(VueTheMask);

// vuesax
import Vuesax from "vuesax";
import "vuesax/dist/vuesax.css"; //Vuesax styles
Vue.use(Vuesax, {
  // options here
});

import "@/filters/index.js";

// Animaciones de los elementos con animate.css
import VAnimateCss from "v-animate-css";
Vue.use(VAnimateCss);
// Input de Tel
import VueTelInput from "vue-tel-input";

Vue.use(VueTelInput);

Vue.config.productionTip = false;

let app;
auth.onAuthStateChanged(user => {
  if (!app) {
    if (user) {
      store.commit("auth/SET_LOGIN", user);
      store.dispatch("auth/bindUser", user.uid).then(() => {
        app = new Vue({
          router,
          store,
          vuetify,
          render: h => h(App)
        }).$mount("#app");
      });
    } else {
      app = new Vue({
        router,
        store,
        vuetify,
        render: h => h(App)
      }).$mount("#app");
    }
  }
});
