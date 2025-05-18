const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT||3000
 app.use(cors())
 app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.yvnwfkw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    await client.connect();
    const coffeeCollection = client.db('coffeeDB').collection('coffees');
    
    const usersCollection = client.db('coffeeDB').collection('users');

      app.get('/coffees',async(req,res)=>{
        const result = await coffeeCollection.find().toArray() 
        res.send(result)
      })
      // get by one id
      app.get('/coffees/:id',async(req,res)=>{
      const id=req.params.id
      const query={_id: new ObjectId(id)}
      const result=await coffeeCollection.findOne(query)
      res.send(result)

    })
    app.post('/coffees', async (req, res) => {
      try {
        const newCoffee = req.body;
        const result = await coffeeCollection.insertOne(newCoffee);
        res.send(result);
      } catch (err) {
        console.error("Insert error:", err);
        res.status(500).send({ error: 'Insert failed' });
      }
    });
    // update 
    app.put('/coffees/:id',async(req,res)=>{
        const id=req.params.id
      const filter={_id: new ObjectId(id)}
        const options = { upsert: true };
        const updateCoffee = req.body;
          const updateDoc = {
      $set: updateCoffee
    };
      const result = await coffeeCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })

    // delete
    app.delete('/coffees/:id',async(req,res)=>{
      const id=req.params.id
      const query={_id: new ObjectId(id)}
      const result=await coffeeCollection.deleteOne(query)
      res.send(result)

    })
    // user related api 
    app.get('/users',async(req,res)=>{
      result=await usersCollection.find().toArray()
      res.send(result)
    })
            // patch data
            app.patch('/user',async(req,res)=>{
            const{email,lastSignInTime}=req.body
            console.log("PATCH received:", email, lastSignInTime);
            const filter={email:email}
            const updateDoc = {
        $set: {
            lastSignInTime:lastSignInTime
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result)


      })

    app.post('/users',async(req,res)=>{
      const userProfile=req.body
      const result=await usersCollection.insertOne(userProfile)
      res.send(result)
    })
    // delete
    app.delete('/users/:id',async(req,res)=>{
      const id=req.params.id
      const query={_id: new ObjectId(id)}
      const result=await usersCollection.deleteOne(query)
      res.send(result)

    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}


run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('coffee server is getting hotter')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
