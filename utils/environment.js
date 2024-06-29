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
  // google: {
  //   clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
  //   clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  //   redirectUrl: process.env.GOOGLE_OAUTH_REDIRECT_URL,
  //   reactUrl: process.env.GOOGLE_REACT_URL,
  //   place: {
  //     apiKey: process.env.GOOGLE_PLACE_API_KEY,
  //   },
  // },
};
