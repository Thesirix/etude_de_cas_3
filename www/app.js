const { server } = require("../server");
const config = require("../config");
const mongoose = require("mongoose");

mongoose.connect(config.mongoUri);

const db = mongoose.connection;

db.on("error", (err) => {
  console.log(err);
});

db.on("open", () => {
  console.log("Database connected");
  console.log("mongodb://localhost:27017/");
  console.log("http://localhost:3000/");
});

server.listen(config.port, () => {
  console.log("app running");
});
