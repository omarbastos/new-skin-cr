<template>
  <div>
    <div ref="paypal"></div>
  </div>
</template>

<script>
// import image from "../assets/lamp.png"
export default {
  name: 'PayPal',

  data: function() {
    return {
      loaded: false,
      paidFor: false,
      product: {
        price: 777.77,
        description: 'leg lamp from that one movie',
        img: './assets/lamp.jpg',
      },
    };
  },
  mounted: function() {
    const script = document.createElement('script');
    script.src =
      'https://www.paypal.com/sdk/js?client-id=AdenSt7X3Jet21WVc9985ah4A7Jflcuz5Dv8swBeNRpGZCOYSSgdNz7UodlunoixRMXPj8zrJbkhr7oH';
    script.addEventListener('load', this.setLoaded);
    document.body.appendChild(script);
  },
  methods: {
    async setLoaded() {
      this.loaded = true;

      const {
        rates,
      } = await fetch(
        'https://api.currencyfreaks.com/latest?apikey=0ec7e8eb6c194dbfa9a021f2132b3489&symbols=CRC',
        { method: 'GET' }
      );
      this.total = this.total / rates.CRC;
      console.log(this.total);
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: this.product.description,
                  amount: {
                    currency_code: 'USD',
                    value: this.total,
                  },
                },
              ],
            });
          },
        })
        .render(this.$refs.paypal);
    },
  },
};
</script>
