<template>
  <v-app>
    <LoadLayout v-if="isLoading">
      <BaseLoading />
    </LoadLayout>

    <MainLayout v-else />
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import LoadLayout from "./layouts/LoadLayout";
import MainLayout from "./layouts/MainLayout";
import BaseLoading from "@/components/BaseLoading.vue";

export default {
  name: "App",
  components: {
    MainLayout,
    LoadLayout,
    BaseLoading
  },
  computed: {
    ...mapState("loading", {
      isLoading: "isLoading"
    })
  },
  created() {}
};
</script>

<style lang="stylus">
/* ** TRANSITIONS ** */
.fade-enter {
  opacity: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease-out;
}

.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter {
  transform: translateX(10px);
  opacity: 0;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.2s ease;
}
th {
  vertical-align: middle !important;
}
.slide-fade-leave-to {
  transform: translateX(-10px);
  opacity: 0;
}

.slide-up-enter {
  transform: translateY(10px);
  opacity: 0;
}

.slide-up-enter-active {
  transition: all 0.2s ease;
}

.slide-up-move {
  transition: transform 0.5s ease-out;
}
</style>
