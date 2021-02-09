<template>
  <v-container
    class="d-flex justify-center align-center"
    style="height:100vh"
  >
    <div class="loading-wrapper text-center py-5">
      <div class="spinner-wrapper w-100">
        <v-progress-circular
          :size="70"
          :width="7"
          color="primary"
          indeterminate
        >
          <v-icon>mdi-cart</v-icon>
        </v-progress-circular>
      </div>
      <h1 class="my-5">Cargando...</h1>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Loading",
  // Propiedades que soporta nuestro componente
  props: {
    variant: {
      required: false,
      type: String,
      // Valor por defecto, en caso de que no le pasemos esta prop
      default: "info",
      validator: value => {
        // Función validadora:
        // El valor de la prop debe coincidir con una de estas palabras
        return (
          [
            "primary",
            "secondary",
            "danger",
            "warning",
            "success",
            "info",
            "light",
            "dark"
          ].indexOf(value) !== -1
        );
      }
    },
    type: {
      required: false,
      type: String,
      default: "border",
      validator: value => {
        return ["border", "grow"].indexOf(value) !== -1;
      }
    }
  }
};
</script>

<style lang="stylus">
.spinner-wrapper {
  .spinner {
    width: 4rem;
    height: 4rem;
  }
}
</style>
