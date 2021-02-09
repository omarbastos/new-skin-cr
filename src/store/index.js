import Vue from "vue";
import Vuex from "vuex";
//import { vuexfireMutations } from "vuexfire";
import "firebase/firestore";
/* Modulos */
import loading from "./modules/loading";

import { vuexfireMutations } from "vuexfire";
import cart from "./modules/cart";
import auth from "./modules/auth";
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    loading,
    auth,
    cart
  },
  mutations: {
    ...vuexfireMutations
  }
});
