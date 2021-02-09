import { vuexfireMutations, firestoreAction } from "vuexfire";

import { db } from "@/api/db.js";
export default {
  namespaced: true,

  // setup the reactive todos property
  state: {
    cars: [],
    carsNew: [],
    carsUsed: [],
    carQuery: {}
  },

  mutations: {
    ...vuexfireMutations
  },
  actions: {
    bindCars: firestoreAction(context => {
      return context.bindFirestoreRef("cars", db.collection("cars"));
    }),

    bindCarsNew: firestoreAction(context => {
      return context.bindFirestoreRef(
        "carsNew",
        db.collection("cars").where("isNew", "==", true)
      );
    }),

    bindCarsUsed: firestoreAction(context => {
      return context.bindFirestoreRef(
        "carsUsed",
        db.collection("cars").where("isNew", "==", false)
      );
    }),
    bindSingleCar: firestoreAction((context, id) => {
      return context.bindFirestoreRef(
        "carQuery",
        db.collection("cars").doc(id)
      );
    })
  },
  getters: {}
};
