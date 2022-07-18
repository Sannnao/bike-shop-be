"use strict";
const { dbConfig } = require("../dbConfig");
const { Client } = require("pg");

module.exports.updateProduct = async (event) => {
  const client = new Client(dbConfig);
  await client.connect();

  try {
    const { productId } = event.pathParameters;
    const payload = JSON.parse(event.body);

    const { title, description, price, count } = payload;

    const buildUpdateString = () => {
      let string = "";
      if (title) {
        string += `title = '${title}'`;
      }
      if (description) {
        if (string) {
          string += `, description = '${description}'`;
        } else {
          string += `description = '${description}'`;
        }
      }
      if (price !== undefined) {
        if (string) {
          string += `, price = '${price}'`;
        } else {
          string += `price = '${price}'`;
        }
      }

      return string;
    };

    let updateProductResult;

    if (title || description || price !== undefined) {
      updateProductResult = await client.query(
        `
              update products set ${buildUpdateString()}
              where id = '${productId}'
              returning *
            `
      );
    }

    let updatedStockResult;

    if (count !== undefined) {
      updatedStockResult = await client.query(
        `
            update stocks set count = ${count}
            where product_id = '${productId}'
            returning *
        `
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        ...(updateProductResult && { ...updateProductResult.rows[0] }),
        ...(updatedStockResult && { ...updatedStockResult.rows[0] }),
      }),
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
