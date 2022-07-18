const { getProducts } = require("./functions/getProducts");
const { getProductById } = require("./functions/getProductById");
const { addProduct } = require("./functions/addProduct");
const { updateProduct } = require("./functions/updateProduct");

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
};
