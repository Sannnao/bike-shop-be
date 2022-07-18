"use strict";
const { dbConfig } = require("../dbConfig");
const { Client } = require("pg");

module.exports.getProductById = async (event) => {
  const client = new Client(dbConfig);
  await client.connect();

  try {
    const { productId } = event.pathParameters;

    const selectProductResult = await client.query(
      `
        select * from products LEFT JOIN stocks ON products.id = stocks.product_id
          where id = '${productId}'
      `
    );
    const [foundProduct] = selectProductResult.rows;

    return {
      statusCode: 200,
      body: JSON.stringify(foundProduct),
    };
  } catch (err) {
    console.error("Error during database request executing:", err);

    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  } finally {
    client.end();
  }
};
