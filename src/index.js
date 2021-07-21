const express = require("express");
require("./db/mongoose");
const dotenv = require('dotenv')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')


const app = express();
dotenv.config()
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
  console.log("server is runnning at " + port);
});

