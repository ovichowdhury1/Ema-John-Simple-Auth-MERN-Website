const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
//midleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wnsnzvm.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run(){
    try{
         const productsCollection = client.db('emajohn').collection('products');
         app.get('/products',async(req,res)=>{
               const page = parseInt(req.query.page);
               const size = parseInt(req.query.size);
               console.log(page,size);
               const query = {};
               const cursor = productsCollection.find(query);
               const products = await cursor.skip(page*size).limit(size).toArray();
               const count = await productsCollection.estimatedDocumentCount();
               res.send({count,products});
         })
        app.post('/productsByIds',async(req,res)=>{
           const ids = req.body;
           console.log(ids);
           const objectId = ids.map(id =>new ObjectId(id))
           console.log(objectId );
           const query = {_id:{$in: objectId}};
           const cursor = productsCollection.find(query);
           const products = await cursor.toArray();
           res.send(products);
        })
    }
    finally{

    }
}
run().catch(err=> console.log(err));

app.get('/',(req,res)=>{
    res.send('ema john server is running');
})
app.listen(port,()=>{
    console.log(`server is running on ${port}`);
})