import { db } from "@/api/firebase.js";
export default {
  namespaced: true,
  state: {},
  mutations: {
    SET_ERROR(state, payload) {
      state.error = payload;
    }
  },
  actions: {
    ADD_ITEM(context, payload) {
      return new Promise((resolve, rejected) => {
        db.collection("carrito")
          .add(payload)
          .then(res => {
            db.collection("carrito")
              .doc(res.id)
              .update({
                id: res.id
              })
              .then(() => {
                resolve();
              });
          })
          .catch(e => {
            rejected(e);
          });
      });
    }
  }
};
