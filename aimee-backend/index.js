const express = require("express");
const routes = require("./src/routes");
const initSocketRoutes = require("./src/routes/socket.route");
const cors = require("cors");
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/swagger/swaggerDocs");
const bodyParser = require("body-parser");
const basicAuth = require("express-basic-auth");
const fileUpload = require("express-fileupload");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const port = process.env.SWAGGER_PORT || 3001;

//for socket part
const SOCKET_PORT = process.env.SOCKET_PORT || 9000;

const httpsServer = http.createServer(app);
const socketServer = http.Server(app).listen(SOCKET_PORT, () => {
  console.log("WebSocket listening on port %d", SOCKET_PORT);
});
const io = require("socket.io")(socketServer, {
  cors: {
    origin: "*",
  },
});

// server.listen(socketport, () => {
//   console.log(`Server is running on port ${socketport}`);
// });

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
  }
  next();
});
app.use(
  fileUpload({
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: "/tmp/",
    debug: true,
    uploadTimeout: 0,
    AllowMultiple: true,
  })
);
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Use body-parser middleware to parse form data
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());

//Cors
app.use(cors());
// Main Route
app.use("/", routes);

const users = {
  admin: "admin",
  James2Window: "Moon2SkyAndBack$",
};
const auth = basicAuth({
  users,
  challenge: true,
  unauthorizedResponse: "Unauthorized access",
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

httpsServer.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  initSocketRoutes(io);
});
