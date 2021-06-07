require('dotenv').config();

const config = {
  serverUrl: process.env.SERVER_URL,
  serverPort: process.env.SERVER_PORT,
  databaseHost: process.env.SERVER_DB_HOST,
  databaseUser: process.env.SERVER_DB_USER,
  databasePwd: process.env.SERVER_DB_PWD,
  databaseName: process.env.SERVER_DB_NAME,
  databaseDialect: process.env.SERVER_DB_DIALECT,
  jwtSecret: process.env.JWT_SECRET,
};

export default config;