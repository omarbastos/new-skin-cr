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
          <v-toolbar-title class="white--text">Banners</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog fullscreen="" v-model="dialog">
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
                        v-model="editedItem.num"
                        label="Numero del Banner"
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.name"
                        label="Nombre del Banner"
                      ></v-text-field>
                      <photo-upload @downloadURL="setImg"></photo-upload>
                      <div class="mt-2 caption text-center">
                        La imagen debe ser en .png o jpeg de 1280px x 400px
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :x-large="$vuetify.breakpoint.mdAndUp"
                  dark
                  color="red darken-1"
                  @click="close"
                  >Cancelar</v-btn
                >
                <v-spacer></v-spacer>
                <v-btn
                  :x-large="$vuetify.breakpoint.mdAndUp"
                  dark
                  color="success"
                  @click="save"
                  >Guardar</v-btn
                >
                <v-spacer></v-spacer>
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
      <template v-slot:item.downloadURL="{ item }">
        <v-img width="50" height="50" :src="item.downloadURL"></v-img>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { db, timestamp } from '@/api/firebase';
import PhotoUpload from './PhotoUpload';
export default {
  components: { PhotoUpload },
  data: () => ({
    dialog: false,
    snackbar: false,
    headers: [
      {
        text: 'Numero',
        align: 'start',
        sortable: true,
        value: 'num',
      },
      {
        text: 'Nombre',
        align: 'start',
        sortable: true,
        value: 'name',
      },

      {
        text: 'Preview',
        align: 'start',
        sortable: false,
        value: 'downloadURL',
      },
      { text: 'Eliminar', value: 'action', sortable: false },
    ],
    client: [],
    editedIndex: -1,
    editedItem: {
      num: '',
    },
    defaultItem: {
      num: 1,
    },
  }),
  firestore() {
    return {
      client: db.collection('banners').orderBy('num'),
    };
  },
  computed: {
    formTitle() {
      return 'Nuevo Banner';
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {},

  methods: {
    setImg(payload) {
      this.editedItem.downloadURL = payload.downloadURL;
      this.editedItem.fileName = payload.fileName;
    },
    deleteItem(item) {
      const id = item.id;
      confirm('¿Esta seguro que desea eliminar este Banner?') &&
        db
          .collection('banners')
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
      db.collection('banners')
        .add({
          num: this.editedItem.num,
          downloadURL: this.editedItem.downloadURL,
          fileName: this.editedItem.fileName,
          name: this.editedItem.name,
          dateCreated: this.editedItem.dateCreated,
        })
        .then((data) => {
          this.client.id = data.id;
          db.collection('banners')
            .doc(data.id)
            .update({
              id: data.id,
            })
            .then(() => {
              this.snackbar = true;
              this.editedItem = null;
            });
        });

      this.close();
    },
  },
};
</script>

<style></style>
