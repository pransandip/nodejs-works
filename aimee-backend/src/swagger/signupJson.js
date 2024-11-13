const j2s = require("joi-to-swagger");
const { Cschema, authSchema } = require("../schemas/userSchema");
const { swagger: createSchema } = j2s(Cschema);
const { swagger: authenticateSchema } = j2s(authSchema);

module.exports = {
  schemas: {
    PasswordMatchExpression: {
      const: true,
      message: "Password does not match",
    },
    createSchema: {
      ...createSchema,
    },
    authenticateSchema: {
      ...authenticateSchema,
    },
  },
  paths: {
    "/user/signup": {
      get: {
        summary: "Get SignIn Service Status",
        description: "Check if the SignUp service is running.",
        tags: ["User"],
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#components/schemas/createSchema",
                },
              },
            },
          },
        },
      },
    },
    "/user/{id}": {
      get: {
        summary: "Get User  by ID",
        description: "Get User details by id.",
        tags: ["User"],
        parameters: [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string",
          }
      ],
        responses: {
          200: {
            description: "User data.",
            content: {
              "application/json": {
                // schema: {
                //   $ref: "#components/schemas/userResponse200",
                // },
              },
            },
          },
          500: {
            description: "Something went wrong!",
          },
        },
      },
    },
    "/user/signin": {
      post: {
        summary: "Get SignIn Service Status",
        description: "Check if the SignIn service is running.",
        tags: ["User"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#components/schemas/authenticateSchema",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#components/schemas/authenticateSchema",
                },
              },
            },
          },
        },
      },
    },
    "/user": {
      get: {
        summary: "Get All users",
        description: "Get All users",
        tags: ["User"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#components/schemas/authenticateSchema",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#components/schemas/authenticateSchema",
                },
              },
            },
          },
        },
      },
    },
  },
};
