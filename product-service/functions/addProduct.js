"use strict";
const { dbConfig } = require("../dbConfig");
const { Client } = require("pg");

module.exports.addProduct = async (event) => {
  const client = new Client(dbConfig);
  await client.connect();

  try {
    const payload = JSON.parse(event.body);
    const { title, description, price, count } = payload;

    await client.query(
      `
        create table if not exists products (
            id uuid primary key default uuid_generate_v4(),
            title text not null,
            description text,
            price integer
        )
      `
    );

    await client.query(
      `
        create table if not exists stocks (
          product_id uuid,
          count integer,
          foreign key ("product_id") references products ("id") ON DELETE CASCADE
        )
      `
    );

    const createProductResult = await client.query(
      `
        insert into products (title, description, price)
        values ('${title}', '${description}', '${price}')
        returning *
      `
    );

    const [createdProduct] = createProductResult.rows;

    const createStockResult = await client.query(
      `
          insert into stocks (product_id, count)
          values ('${createdProduct.id}', '${count}')
          returning *
        `
    );

    const [createdStock] = createStockResult.rows;

    return {
      statusCode: 200,
      body: JSON.stringify({
        ...createdProduct,
        count: createdStock.count,
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
