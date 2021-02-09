<template>
  <div>
    <div class="d-flex justify-center">
      <v-btn
        :x-large="$vuetify.breakpoint.mdAndUp"
        rounded=""
        @click.native="selectFile"
        color="primary"
        v-if="!uploadEnd && !uploading"
      >
        Cargar imagen referencial
        <v-icon right aria-hidden="true">
          mdi-cloud-upload
        </v-icon>
      </v-btn>
    </div>
    <div class="d-flex justify-center align-center flex-column">
      <form ref="form">
        <input
          id="files"
          type="file"
          name="file"
          ref="uploadInput"
          accept=".jpg, .jpeg, .png"
          :multiple="false"
          @change="detectFiles($event)"
        />
      </form>
      <transition name="fade" mode="out-in">
        <v-progress-circular
          v-if="uploading && !uploadEnd"
          :size="100"
          :width="15"
          :rotate="360"
          :value="progressUpload"
          color="primary"
        >
          {{ progressUpload }}%
        </v-progress-circular>

        <v-img v-if="uploadEnd" :src="downloadURL" width="300" height="auto">
          <v-tooltip left color="primary">
            <template v-slot:activator="{ on }">
              <v-btn
                class="mt-6"
                x-small=""
                v-on="on"
                fab
                top=""
                right
                absolute=""
                color="error"
                @click="deleteImage()"
              >
                <v-icon> mdi-close</v-icon>
              </v-btn>
            </template>
            <span>Eliminar imagen referencial</span>
          </v-tooltip>
        </v-img>
      </transition>
    </div>
    <div v-if="uploadEnd" class="d-flex justify-center"></div>
  </div>
</template>

<script>
// Thanks Marcelo Forclaz(https://github.com/CristalT) https://gist.github.com/CristalT/2651023cfa2f36cddd119fd979581893
// Thanks Matteo Leoni(https://github.com/signalkuppe) https://github.com/signalkuppe/vuetify-cloudinary-upload/blob/master/src/components/v-cloudinary-upload.vue
import { storage } from "@/api/firebase";
export default {
  data() {
    return {
      progressUpload: 0,
      fileName: "",
      uploadTask: "",
      uploading: false,
      uploadEnd: false,
      downloadURL: ""
    };
  },
  mounted() {},
  methods: {
    selectFile() {
      this.$refs.uploadInput.click();
    },
    detectFiles(e) {
      let fileList = e.target.files || e.dataTransfer.files;
      Array.from(Array(fileList.length).keys()).map(x => {
        this.upload(fileList[x]);
      });
    },
    upload(file) {
      this.fileName = file.name;
      this.uploading = true;
      this.uploadTask = storage.ref("banners/" + this.fileName).put(file);
    },
    deleteImage() {
      storage
        .ref("banners/" + this.fileName)
        .delete()
        .then(() => {
          this.uploading = false;
          this.uploadEnd = false;
          this.downloadURL = "";
        });

      this.$refs.form.reset();
    }
  },
  watch: {
    uploadTask: function() {
      this.uploadTask.on(
        "state_changed",
        sp => {
          this.progressUpload = Math.floor(
            (sp.bytesTransferred / sp.totalBytes) * 100
          );
        },
        null,
        () => {
          this.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.uploadEnd = true;
            this.downloadURL = downloadURL;
            this.$emit("downloadURL", {
              downloadURL: this.downloadURL,
              fileName: this.fileName
            });
          });
        }
      );
    }
  }
};
</script>

<style>
.progress-bar {
  margin: 10px 0;
}
input[type="file"] {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
</style>
