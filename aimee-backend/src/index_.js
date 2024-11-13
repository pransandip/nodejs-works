const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require('./swagger/swaggerDocs');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
require("dotenv").config();

const app = express();
const port = process.env.SWAGGER_PORT || 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



app.use(cors());

app.use("/", routes);

const users = {
  admin: 'admin',
  James2Window : 'Moon2SkyAndBack$'
};
const auth = basicAuth({
  users,
  challenge: true,
  unauthorizedResponse: 'Unauthorized access',
})
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
