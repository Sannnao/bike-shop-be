const { getProducts } = require("./functions/getProducts");
const { getProductById } = require("./functions/getProductById");
const { addProduct } = require("./functions/addProduct");

module.exports = {
  getProducts,
  getProductById,
  addProduct,
};
