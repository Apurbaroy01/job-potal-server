const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express())




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.xgolbpd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        console.log("You successfully connected to MongoDB✅!");
    } catch (error) {
        console.error("Error connecting to MongoDB❌:", error)
    }


    const JobCollection = client.db("JobPotal").collection("jobs");

    app.get('/jobs', async(req, res) => {
        const result=await JobCollection.find().toArray()
        res.send(result)
    })


}
run();


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
