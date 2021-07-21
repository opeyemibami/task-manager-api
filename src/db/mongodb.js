const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionUrl = 'mongodb://127.0.0.1:27017'
const dbName = "task-manager";

MongoClient.connect(connectionUrl,{useNewUrlParser:true, 
    useUnifiedTopology: true ,},(error,client)=>{
    if(error){
        return console.log('Unabel to connect to database')
    }
    const db = client.db(dbName)

    // db.collection('users').insertOne({
    //     name: 'Yhemmy',
    //     age: 20
    // })

    db.collection("tasks").insertMany([
      {
        description: "install mongodb",
        completed: true,
      },
      {
        description: "testrun mongodb",
        completed: true,
      },
      {
        description: "insert many into mongodb",
        completed: false,
      },
    ],(error,result)=>{
        if(error){
            return console.log('unable to insert documents')
        }
        console.log(result.ops)
    });

})