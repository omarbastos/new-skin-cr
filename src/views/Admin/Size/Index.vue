<template>
  <v-container
    style="height:80vh"
    class="d-flex justify-center align-center mt-4"
  >
    <v-snackbar dark v-model="snackbar">
      Su actualización está lista
      <v-btn color="primary" @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-data-table
      :headers="headers"
      :items="client"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar color="primary">
          <v-toolbar-title class="white--text">Tallas</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="white" dark class="primary--text mb-2" v-on="on">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Nombre de la Talla"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close"
                  >Cancelar</v-btn
                >
                <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { db, timestamp } from "@/api/firebase";
export default {
  data: () => ({
    dialog: false,
    snackbar: false,
    headers: [
      {
        text: "Nombre",
        align: "start",
        sortable: false,
        value: "name"
      },
      { text: "Eliminar", value: "action", sortable: false }
    ],
    client: [],
    editedIndex: -1,
    editedItem: {
      name: ""
    },
    defaultItem: {
      name: ""
    }
  }),
  firestore() {
    return {
      client: db.collection("productsSize").orderBy("name")
    };
  },
  computed: {
    formTitle() {
      return "Nueva Talla";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {},

  methods: {
    deleteItem(item) {
      const id = item.id;
      confirm("¿Esta seguro que desea eliminar esta Talla?") &&
        db
          .collection("productsSize")
          .doc(id)
          .delete()
          .then(() => {
            this.snackbar = true;
          });
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      this.editedItem.dateCreated = timestamp;
      db.collection("productsSize")
        .add({
          name: this.editedItem.name,
          dateCreated: this.editedItem.dateCreated
        })
        .then(data => {
          this.client.id = data.id;
          db.collection("productsSize")
            .doc(data.id)
            .update({
              id: data.id
            })
            .then(() => {
              this.snackbar = true;
            });
        });

      this.close();
    }
  }
};
</script>

<style></style>
