import {
  timestamp,
  usersCollection,
  fb,
  db,
  faceboookProvider,
  googleProvider
} from "@/api/firebase.js";
import axios from "axios";
import { vuexfireMutations, firestoreAction } from "vuexfire";
export default {
  namespaced: true,

  // setup the reactive todos property
  state: {
    loggedIn: null,
    user: {}
  },

  mutations: {
    ...vuexfireMutations,
    SET_LOGIN(state, user) {
      return new Promise(resolve => {
        state.loggedIn = user.refreshToken;
        state.emailVerified = user.emailVerified;
        resolve;
      });
    },
    SET_LOGOUT(state) {
      return new Promise(resolve => {
        state.loggedIn = null;
        state.emailVerified = null;
        state.user = null;
        resolve;
      });
    }
  },
  actions: {
    bindUser: firestoreAction((context, id) => {
      return context.bindFirestoreRef("user", db.collection("users").doc(id));
    }),
    addCarToWishList: (context, data) => {
      return new Promise((resolve, reject) => {
        db.collection("users")
          .doc(context.state.user.uid)
          .update(data)
          .then(res => resolve(res))
          .catch(e => reject(e));
      });
    },
    removeCarToWishList: (context, data) => {
      return new Promise((resolve, reject) => {
        db.collection("users")
          .doc(context.state.user.uid)
          .update(data)
          .then(res => resolve(res))
          .catch(e => reject(e));
      });
    },
    COLLECION_USUARIO: (context, datos) => {
      return new Promise((resolve, reject) => {
        usersCollection
          .doc(datos.uid)
          .set({
            uid: datos.uid,
            email: datos.email,
            firstName: datos.firstName,
            lastName: datos.lastName,
            phone: null,
            pic: null,
            dateCreated: timestamp,
            admin: false
          })
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    HUBSPOT_NEWUSER: (context, datos) => {
      return new Promise((resolve, reject) => {
        var url =
          "https://api.hsforms.com/submissions/v3/integration/submit/7999895/efb6435c-1cb0-43f9-95c3-6a82f38c820f";

        // Example request JSON:
        var data = {
          fields: [
            {
              name: "firstname",
              value: datos.firstName
            },
            {
              name: "lastname",
              value: datos.lastName
            },
            {
              name: "email",
              value: datos.email
            }
          ],
          context: {
            pageUri: "newskincr.com",
            pageName: "Landing Page"
          }
        };

        var final_data = data;
        axios
          .post(url, final_data)
          .then(res => {
            resolve(res);
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    COLLECION_USUARIO_FB: (context, data) => {
      // console.log(data);
      return new Promise((resolve, reject) => {
        usersCollection
          .doc(data.uid)
          .set({
            uid: data.uid,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            pic: data.pic,
            dateCreated: timestamp,
            admin: false
          })
          .then(
            res => {
              resolve(res);
            },
            error => {
              // console.log(error);
              reject(error);
            }
          )
          .catch(function(error) {
            reject(error);
          });
      });
    },
    FORGOT: (context, forget) => {
      return new Promise((resolve, reject) => {
        fb.auth()
          .sendPasswordResetEmail(forget.email)
          .then(function(res) {
            resolve(res);
          })
          .catch(function(error) {
            reject(error);
            // Error occurred. Inspect error.code.
          });
      });
    },
    CREAR_USUARIO: ({ commit, dispatch }, form) => {
      return new Promise((resolve, reject) => {
        fb.auth()
          .createUserWithEmailAndPassword(form.email, form.password)
          .then(result => {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.

            // The signed-in user info.

            var user = result.user;
            commit("SET_LOGIN", user);

            usersCollection
              .doc(user.uid)
              .get()
              .then(function(doc) {
                if (doc.exists) {
                  resolve(user.uid);
                } else {
                  // doc.data() will be undefined in this case

                  {
                    var firstName = form.firstName;
                    var lastName = form.lastName;

                    let data = {};
                    data.uid = user.uid;
                    data.email = user.email;
                    data.firstName = firstName;
                    data.lastName = lastName;
                    data.phone = user.phoneNumber;
                    data.dateCreated = timestamp;
                    data.pic = user.photoURL;
                    data.admin = false;
                    data.uid = user.uid;

                    dispatch("COLLECION_USUARIO_FB", data);
                    dispatch("HUBSPOT_NEWUSER", data);
                    resolve(user.uid);
                  }
                }
              })
              .catch(function(error) {
                reject(error);
              });
          })
          .catch(e => {
            reject(e);
          });
      });
    },

    GOOGLE: ({ commit, dispatch }) => {
      return new Promise((resolve, reject) => {
        fb.auth()
          .signInWithPopup(googleProvider)
          .then(function(result) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.

            // The signed-in user info.

            var user = result.user;
            commit("SET_LOGIN", user);

            usersCollection
              .doc(user.uid)
              .get()
              .then(function(doc) {
                if (doc.exists) {
                  resolve(user.uid);
                } else {
                  // doc.data() will be undefined in this case

                  {
                    var firstName = user.displayName
                      .split(" ")
                      .slice(0, -1)
                      .join(" ");
                    var lastName = user.displayName
                      .split(" ")
                      .slice(-1)
                      .join(" ");
                    let data = {};
                    data.uid = user.uid;
                    data.email = user.email;
                    data.firstName = firstName;
                    data.lastName = lastName;
                    data.phone = user.phoneNumber;
                    data.dateCreated = timestamp;
                    data.pic = user.photoURL;
                    data.admin = false;
                    data.uid = user.uid;

                    dispatch("COLLECION_USUARIO_FB", data);
                    dispatch("HUBSPOT_NEWUSER", data);
                    resolve(user.uid);
                  }
                }
              })
              .catch(function(error) {
                reject(error);
              });
          });
      });
    },
    FACEBOOK: ({ commit, dispatch }) => {
      return new Promise((resolve, reject) => {
        fb.auth()
          .signInWithPopup(faceboookProvider)
          .then(function(result) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.

            // The signed-in user info.

            var user = result.user;
            commit("SET_LOGIN", user);

            usersCollection
              .doc(user.uid)
              .get()
              .then(function(doc) {
                if (doc.exists) {
                  resolve(user.uid);
                } else {
                  // doc.data() will be undefined in this case

                  {
                    var firstName = user.displayName
                      .split(" ")
                      .slice(0, -1)
                      .join(" ");
                    var lastName = user.displayName
                      .split(" ")
                      .slice(-1)
                      .join(" ");
                    let data = {};
                    data.uid = user.uid;
                    data.email = user.email;
                    data.firstName = firstName;
                    data.lastName = lastName;
                    data.phone = user.phoneNumber;
                    data.dateCreated = timestamp;
                    data.pic = user.photoURL;
                    data.admin = false;
                    data.uid = user.uid;

                    dispatch("COLLECION_USUARIO_FB", data);
                    dispatch("HUBSPOT_NEWUSER", data);
                    resolve(user.uid);
                  }
                }
              })
              .catch(function(error) {
                reject(error);
              });
          });
      });
    },
    SIGN_OUT: ({ commit }) => {
      return new Promise((resolve, reject) => {
        fb.auth()
          .signOut()
          .then(
            res => {
              commit("SET_LOGOUT");

              resolve(res);
            },
            error => {
              reject(error);
            }
          );
      });
    },
    AUTH_STATE_CHANGED: ({ commit, dispatch }) => {
      return new Promise((resolve, reject) => {
        fb.auth().onAuthStateChanged(user => {
          if (user) {
            commit("SET_LOGIN", user);
            dispatch("bindUser", user.uid).then(() => {
              resolve();
            });
          } else {
            reject();
          }
        });
      });
    },
    SIGN_IN: ({ commit }, user) => {
      // console.log(user.email + " " + user.password);
      return new Promise((resolve, reject) => {
        //console.log(user.email + " " + user.password);
        fb.auth()
          .signInWithEmailAndPassword(user.email, user.password)
          .then(
            docRef => {
              commit("SET_LOGIN", docRef.user);
              /*  if (!docRef.user.emailVerified) {
                fb.fb
                  .auth()()
                  .currentUser.sendEmailVerification();
              } */
              resolve(docRef);
            },
            error => {
              reject(error);
            }
          );
      });
    }
  },
  getters: {
    isLoggedIn: state => (state.loggedIn ? true : false)
  }
};
