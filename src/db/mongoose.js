const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const dbName = 'task-manager-api'
const connectionUrl = process.env.MONGO_URI + dbName

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(connectionUrl, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    // console.log(`MongoDB Connected ${conn.connection.host}`)
  } catch (error) {
    // console.log(`Error Db: ${error.message}`)
    process.exit(1)
  }
}

connectDB()