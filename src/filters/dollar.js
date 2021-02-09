/**
 * Returns 0 if no param. Returns `num` formatted
 * @param {Number} num
 */
const formatNumber = (num) => {
  if (!num) {
    return 0;
  }
  let val = (num / 1).toFixed(2).replace(".", ",");
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export { formatNumber };
