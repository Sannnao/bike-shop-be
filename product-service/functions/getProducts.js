"use strict";
const { Client } = require("pg");
const { dbConfig } = require("../dbConfig");

module.exports.getProducts = async () => {
  const client = new Client(dbConfig);
  await client.connect();

  try {
    const selectResult = await client.query(
      `select * from products LEFT JOIN stocks ON products.id = stocks.product_id`
    );
    const { rows: products } = selectResult;

    return {
      statusCode: 200,
      body: JSON.stringify(products),
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
