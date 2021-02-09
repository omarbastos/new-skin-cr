import Vue from "vue";
import Cart from "@/components/icons/Cart.vue";
import About from "@/components/icons/About.vue";
import Products from "@/components/icons/Products.vue";
import Home from "@/components/icons/Home.vue";
import Giftcard from "@/components/icons/Giftcard.vue";
import Google from "@/components/icons/Google.vue";
import Facebook from "@/components/icons/facebook.vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    values: {
      Cart: {
        component: Cart,
        props: {
          name: "cart"
        }
      },

      About: {
        component: About,
        props: {
          name: "about"
        }
      },

      Products: {
        component: Products,
        props: {
          name: "products"
        }
      },
      Home: {
        component: Home,
        props: {
          name: "home"
        }
      },
      Giftcard: {
        component: Giftcard,
        props: {
          name: "giftcards"
        }
      },
      Google: {
        component: Google,
        props: {
          name: "google"
        }
      },
      Facebook: {
        component: Facebook,
        props: {
          name: "facebook"
        }
      }
    }
  },

  theme: {
    themes: {
      light: {
        primary: "#19A7F6",
        secondary: "#005BEA",
        accent: "#0864C3",
        error: "#FF0000",
        success: "#34A853",
        warning: "#FFC72E",
        info: "#5576D6",
        background: "#131419"
      }
    },
    light: true
  }
});
