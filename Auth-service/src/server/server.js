const express = require("express");
const http = require("http");
const userModule = require("../index");
const cors = require("cors");

const app = express();
app.use(cors());
const store = userModule.getDbAdapter("sequelize");

// Bind the routes under [apiMountPoint] (default: ***/api/users***):
userModule.listen(app, (apiMountPoint = "/api/auth"), (customRoutes = {}));

(async function () {
  const server = http.createServer(app);

  // Establish a connection to the data store
  // Ensure the db is connected before binding the server to the port
  await store.connect({
    host: "users-do-user-11618473-0.b.db.ondigitalocean.com",
    port: "25060",
    user: "doadmin",
    pass: "AVNS_o_FsLJJT8ZBvGHz",
    engine: "MySQL",
    dbName: "defaultdb",
    debug: false,
  });

  // set port, listen for requests
  const PORT = process.env.PORT || 3001;

  // Proceed with normal server initialization tasks
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
})();
