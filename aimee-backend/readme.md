SWAGGER IMPEMENTATION:

Files :
1. Index.js (has configuration of swagger)
2. Swagger (folder inside src)
       1. signupJson (sub file)
       2. swaggerDocs (sub file)

Features:
   swagger basically takes schema and api path which is written in signupJson file.
   schema will be passed in the path as 

   schema: 
            {
                $ref: "#components/schemas/authenticateSchema",
            },

   Here  authenticateSchema is the schema which is being passed in the path for signup 
   api. Here are the Joi schema's are being passed to the swagger.

   Joi schema is passed to joi-to-swagger npm module to get the Joi format converted to
   yml , which is the only format accepted by swagger.

   All configuration related to signup will be written in signupJson.js file. And this will 
   further be imported into swaggerDocs.js file .

   swaggerDocs.js is the main file for swagger where all the path related to api will be imported 
   and this will further be imported in the index.js file
   
   Link : http://localhost:3001/api-docs/
   