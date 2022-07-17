const { host, port, database, user, password } = process.env;

module.exports.dbConfig = {
  host,
  port,
  database,
  user,
  password,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};
