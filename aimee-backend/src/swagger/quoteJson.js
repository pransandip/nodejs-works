const j2s = require("joi-to-swagger");
const { updateQuoteValidation,getAllQuoteValidation ,createQuoteValidation} = require("../schemas/CRM/quoteSchema");
const { swagger: updateQuoteSchema } = j2s(updateQuoteValidation);
const { swagger: getAllQuoteSchema } = j2s(getAllQuoteValidation);
const { swagger: createQuoteSchema } = j2s(createQuoteValidation);


module.exports = {
  schemas: {
    PasswordMatchExpression: {
      const: true,
      message: "Password does not match",
    },
    updateQuoteSchema: {
      ...updateQuoteSchema,
    },
    getAllQuoteSchema: {
      ...getAllQuoteSchema,
    },
    createQuoteSchema: {
      ...createQuoteSchema,
    },
  },
  paths: {
    "/crm/quote": {
      get: {
        summary: "Get Quote Service Status",
        description: "Check if the Quote service is running.",
        tags: ["Quote"],
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                // schema: {
                //   $ref: "#components/schemas/createSchema",
                // },
              },
            },
          },
        },
      },
    },
    "/crm/quote/quoteDetails/{id}": {
      get: {
        summary: "Get QuoteDetails  by ID",
        description: "Check if the QuoteDetails service is running.",
        tags: ["Quote"],
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
            description: "Quote detail.",
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
  
    "/crm/quote/update/{id}": {
      post: {
        summary: "Update quote by ID",
        description: "Check if the Quote update service is running.",
        tags: ["Quote"],
        parameters: [
          {
              name: "queryParams",
              in: "path",
              required: false,
              schema: {
                  type : 'object',
                  properties : {
                    id : {type : 'string'}
                  }
              },
          },
      ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#components/schemas/updateQuoteSchema",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Quote detail.",
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

    "/crm/quote/getAllQuotes": {
      post: {
        summary: "Get getAllQuotes Service Status",
        description: "Check if the getAllQuotes service is running.",
        tags: ["Quote"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#components/schemas/getAllQuoteSchema",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                // schema: {
                //   $ref: "#components/schemas/getAllQuoteSchema",
                // },
              },
            },
          },
        },
      },
    },

    "/crm/quote/{id}": {
      get: {
        summary: "Get Quote  by ID",
        description: "Check if the Quote service is running.",
        tags: ["Quote"],
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
            description: "Quote data.",
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
    
    //not working due to schema not being passed in the api
    "/crm/quote/create": {
      post: {
        summary: "Get create quote Service Status",
        description: "Check if the create quote service is running.",
        tags: ["Quote"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#components/schemas/createQuoteSchema",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                // schema: {
                //   $ref: "#components/schemas/getAllQuoteSchema",
                // },
              },
            },
          },
        },
      },
    },
    
    

  },
};
