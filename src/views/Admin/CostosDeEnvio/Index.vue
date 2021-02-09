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
      :items="costosDeEnvio"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar color="primary">
          <v-toolbar-title class="white--text"
            >Costos de Envios</v-toolbar-title
          >
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">Editar Costo</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        type="number"
                        v-model.number="editedItem.value"
                        label="Costo en ₡"
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
        <v-icon small @click="editItem(item)">
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { db } from '@/api/firebase';
export default {
  data: () => ({
    dialog: false,
    snackbar: false,
    headers: [
      {
        text: 'Nombre',
        align: 'start',
        sortable: false,
        value: 'text',
      },
      {
        text: 'Costo',
        align: 'start',
        sortable: false,
        value: 'value',
      },
      { text: 'Editar', value: 'action', sortable: false },
    ],
    costosDeEnvio: [],
    editedIndex: -1,
    editedItem: {
      name: '',
    },
    defaultItem: {
      name: '',
    },
  }),
  firestore() {
    return {
      costosDeEnvio: db.collection('costosDeEnvio').orderBy('value'),
    };
  },
  computed: {
    formTitle() {
      return 'Nueva Categoria';
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {},

  methods: {
    editItem(item) {
      this.dialog = true;
      this.editedItem = item;
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      db.collection('costosDeEnvio')
        .doc(this.editedItem.uid)
        .update({
          value: this.editedItem.value,
        });
      this.close();
    },
  },
};
</script>

<style></style>
