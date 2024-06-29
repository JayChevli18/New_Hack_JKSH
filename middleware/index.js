const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");


const middleware = [];
middleware.push(
  cors({
    origin: true,
    credentials: true,
  })
);

middleware.push(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https: data:"],
    },
  })
);

middleware.push(compression());

module.exports = middleware;
