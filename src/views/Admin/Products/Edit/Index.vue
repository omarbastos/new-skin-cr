<template>
  <v-container>
    <v-card class="elevation-12" style="border-radius: 24px 4px;">
      <v-card-title
        class="primary text-center d-flex justify-center white--text"
        >Editar Producto</v-card-title
      >
      <v-card-text>
        <v-form dark ref="form" v-model="valid" lazy-validation>
          <v-row justify="center" align="center">
            <v-col cols="12" md="12" justify="center" align="center">
              <upload-file
                :downloadURL="product.productImage"
                :fileName="product.productFileName"
                class="my-12"
                @downloadURL="saveUrl"
              ></upload-file>
            </v-col>

            <v-col cols="12" md="6" justify="center" align="center">
              <v-text-field
                prepend-inner-icon="mdi-rename-box"
                rounded
                outlined
                filled
                v-model="product.productName"
                label="Nombre del Producto"
                :rules="rulesName"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" justify="center" align="center">
              <v-text-field
                prepend-inner-icon="mdi-barcode-scan"
                rounded
                outlined
                filled
                v-model="product.productCodigo"
                label="Codigo"
                :rules="rulesUpc"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="12" justify="center" align="center">
              <v-textarea
                counter=""
                row-height="4"
                prepend-inner-icon="mdi-card-text"
                rounded
                outlined
                :rules="rulesDescription"
                filled
                v-model="product.productDescription"
                label="Descripción del Producto"
              ></v-textarea>
            </v-col>
            <v-col cols="12" md="6" justify="center" align="center">
              <v-select
                v-model="product.productCategory"
                :items="categories"
                attach
                chips
                rounded
                outlined
                filled
                prepend-inner-icon="mdi-label"
                label="Categorias"
                item-value="name"
                :rules="rulesCategory"
                item-text="name"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6" justify="center" align="center">
              <v-select
                v-model="product.productColor"
                :items="colors"
                attach
                chips
                rounded
                outlined
                filled
                :rules="rulescolor"
                prepend-inner-icon="mdi-palette"
                label="Color"
                item-value="name"
                item-text="name"
                multiple
                return-object=""
              ></v-select>
            </v-col>
            <v-col cols="12" md="6" justify="center" align="center">
              <v-select
                v-model="product.productSize"
                :items="sizes"
                attach
                chips
                rounded
                outlined
                filled
                :rules="rulesTallas"
                prepend-inner-icon="mdi-palette"
                label="Tamaño"
                item-value="name"
                item-text="name"
                multiple
                return-object=""
              ></v-select>
            </v-col>
            <v-col cols="12" md="6" justify="center" align="center">
              <v-text-field
                prepend-inner-icon="mdi-cart"
                rounded
                outlined
                type="number"
                filled
                :rules="rulesInventory"
                v-model="product.productInventory"
                label="Inventario"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" justify="center" align="center">
              <v-text-field
                prepend-inner-icon="mdi-cash-usd"
                rounded
                outlined
                filled
                type="number"
                :rules="rulesPrice"
                v-model="product.productPrice"
                label="Precio"
              ></v-text-field>
            </v-col>
          </v-row>
          <div class="my-6 d-flex justify-center">
            <v-btn
              @click="validate"
              x-large
              rounded
              class="mx-auto"
              color="primary"
              dark
              :disabled="disableButton"
            >
              Guardar Producto<v-icon>mdi-content-save</v-icon>
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { db, timestamp } from "@/api/firebase.js";
import UploadFile from "./ProductPhoto";
export default {
  data: () => ({
    valid: true,
    colors: [],
    sizes: [],
    product: {},
    categories: [],
    rulesName: [
      v => !!v || "El nombre del producto es obligatorio",
      v =>
        (v && v.length <= 30) ||
        "El nombre del producto debe contener menos de 30 caracteres"
    ],
    rulesUpc: [v => !!v || "El codigo del producto es obligatorio"],
    rulesDescription: [
      v => !!v || "La descripción del producto es obligatoria",
      v =>
        (v && v.length > 15) ||
        "La descripción del producto debe ser al menos de 15 caracteres"
    ],
    rulesCategory: [v => !!v || "La categoria es obligatoria"],
    rulescolor: [
      v =>
        v.length > 0 || "El producto debe estar al menos disponible en un color"
    ],
    rulesTallas: [
      v =>
        v.length > 0 ||
        "El producto debe estar al menos disponible en una talla"
    ],
    rulesInventory: [
      v => !!v || "El Inventario es obligatorio",
      v => !!(v && v > 0) || "El invetario debe ser al menos 1"
    ],
    rulesPrice: [
      v => !!v || "El Precio es obligatorio",
      v => !!(v && v > 0) || "El Precio debe ser mayor que 0$"
    ]
  }),
  computed: {
    imagenWatcher() {
      if (this.product.productImage && this.product.productFileName) {
        return true;
      } else {
        return false;
      }
    },
    disableButton() {
      if (this.valid && this.imagenWatcher) {
        return false;
      } else {
        return true;
      }
    }
  },
  components: {
    UploadFile
  },
  firestore() {
    return {
      colors: db.collection("colors").orderBy("name"),
      categories: db.collection("productsCategory").orderBy("name"),
      product: db.collection("catalogo").doc(this.$route.params.id),
      sizes: db.collection("productsSize").orderBy("name")
    };
  },
  methods: {
    saveUrl(downloadURL) {
      this.product.productImage = downloadURL.downloadURL;
      this.product.productFileName = downloadURL.fileName;
    },
    validate() {
      let createdBy = this.$store.state.auth.user.email;
      if (this.$refs.form.validate()) {
        db.collection("catalogo")
          .doc(this.$route.params.id)
          .update({
            dateCreated: timestamp,
            createdBy: createdBy,
            productName: this.product.productName,
            productInventory: parseInt(this.product.productInventory),
            productPrice: parseInt(this.product.productPrice),
            productCategory: this.product.productCategory,
            productImage: this.product.productImage,
            productDescription: this.product.productDescription,
            productCodigo: this.product.productCodigo,
            productSize: this.product.productSize,
            productFileName: this.product.productFileName,
            productColor: this.product.productColor,
            disable: false,
            destacados: false
          })
          .then(() => {
            this.snackbar = true;
            this.$router.push("/admin/products");
          });
      }
    }
  }
};
</script>

<style>
.theme--dark.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  background-color: rgb(208, 55, 55) !important;
}
</style>
