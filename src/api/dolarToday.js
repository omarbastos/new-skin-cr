import axios from "axios";

const tasa = axios
  .get("https://s3.amazonaws.com/dolartoday/data.json")
  .then((response) => {
    return response.data.USD.transferencia;
  });

export { tasa };
