"use strict";
const { dbConfig } = require("../dbConfig");
const { Client } = require("pg");

module.exports.addProduct = async (event) => {
  const client = new Client(dbConfig);
  await client.connect();

  try {
    const payload = JSON.parse(event.body);
    const { title, description, price } = payload;

    await client.query(
      `
        insert into products (title, description, price)
        values ('${title}', '${description}', '${price}')
      `
    );

    return {
      statusCode: 200,
      body: JSON.stringify("nice"),
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
