require("dotenv").config();

module.exports = {
  domain: process.env.DOMAIN,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiredIn: process.env.JWT_EXPIRED_IN,
  },

  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  server: process.env.SERVER,
  database: {
    uri: process.env.DB_URI,
  },
};
