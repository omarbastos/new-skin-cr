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
        <v-toolbar color="secondary">
          <v-toolbar-title class="white--text">Color</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="white" dark class="secondary--text mb-2" v-on="on">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row justify="center" align="center">
                    <v-col
                      justify="center"
                      align="center"
                      cols="12"
                      sm="12"
                      md="12"
                    >
                      <v-text-field
                        v-model="editedItem.name"
                        label="Nombre del Color"
                      ></v-text-field>
                      <v-color-picker v-model="editedItem.hex"></v-color-picker>
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
      <template v-slot:item.hex="{ item }">
        <v-icon x-large :color="item.hex">
          mdi-circle
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
      { text: "Color", value: "hex", sortable: false },
      { text: "Eliminar", value: "action", sortable: false }
    ],
    client: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      hex: ""
    },
    defaultItem: {
      name: "",
      hex: ""
    }
  }),
  firestore() {
    return {
      client: db.collection("colors").orderBy("name")
    };
  },
  computed: {
    formTitle() {
      return "Nuevo Color";
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
      confirm("¿Esta seguro que desea eliminar este color?") &&
        db
          .collection("colors")
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
      db.collection("colors")
        .add({
          name: this.editedItem.name,
          hex: this.editedItem.hex,
          dateCreated: this.editedItem.dateCreated
        })
        .then(data => {
          this.client.id = data.id;
          db.collection("colors")
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
