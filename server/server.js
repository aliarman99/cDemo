const { createServer } = require("http");
const path = require("path");
const express = require("express");
const compression = require("compression");
const morgan = require("morgan");

const app = express();

const normalizePort = (port) => parseInt(port, 10);
const port = normalizePort(process.env.PORT || 8080);

const dev = app.get("env") !== "production";

if (!dev) {
  app.disable("x-powered-by");
  app.use(compression());
  app.use(morgan("common"));
  app.use(express.static(path.resolve(__dirname, "..", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "build", "index.html"));
  });
}

if (dev) {
  app.use(morgan("dev"));
}

const server = createServer(app);

server.listen(port, (err) => {
  if(err) throw err
  console.log('server started')
});

