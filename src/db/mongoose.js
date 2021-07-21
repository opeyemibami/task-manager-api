const mongoose = require("mongoose");
const dotenv = require('dotenv')
dotenv.config()

const dbName = "task-manager-api";
const connectionUrl = process.env.MONGO_URI + dbName

mongoose.connect(connectionUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});