const signupJson = require("./signupJson");
// const quoteJson = require('./quoteJson');

const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Amiee Api Documentation",
    description:
      "This is a Snippets API Backend Server based on the OpenAPI 3.0 specification",
    version: "v1",
    contact: {
      email: "",
    },
    license: {
      name: "BSD License",
    },
  },
  consumes: ["application/json"],
  produces: ["application/json"],
  schemes: ["http", "https"],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        in: "header",
        name: "Authorization",
        description: "Bearer token to access these api endpoints",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: { ...signupJson.schemas },
  },
  security: [{ bearerAuth: [] }],
  paths: { ...signupJson.paths },
};

module.exports = swaggerSpec;
