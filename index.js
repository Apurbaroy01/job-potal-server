const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const JobApplication = client.db("JobPotal").collection("job-applications");

    app.post('/jobs', async (req, res) => {
        const job = req.body;
        console.log(job)
        const result = await JobCollection.insertOne(job)
        res.send(result)
    });

    app.get('/jobs', async (req, res) => {
        const email = req.query.email;
        let query = {};
        if (email) {
            query = { hrEmail: email }
        }
        const result = await JobCollection.find(query).toArray()
        res.send(result)
    });

    app.get('/jobs/:id', async (req, res) => {
        const id = req.params.id
        console.log(id)
        const query = { _id: new ObjectId(id) }
        const result = await JobCollection.findOne(query)
        res.send(result)
    })

    app.post('/job-applications', async (req, res) => {
        const application = req.body;
        // console.log(application)
        const result = await JobApplication.insertOne(application)

        const id = application.job_id;
        const query = { _id: new ObjectId(id) }
        const job = await JobCollection.findOne(query)
        console.log(job)

        let count = 0;

        if (job.applicationCount) {
            newCount = job.applicationCount + 1;
        } else {
            newCount = 1;
        }

        const fIlter = { _id: new ObjectId(id) }
        const updateDoc = {
            $set: {
                applicationCount: newCount
            },
        }
        const updateResult = await JobCollection.updateOne(fIlter, updateDoc)

        console.log(updateResult)

        res.send(result)
    })
    app.get('/job-applications', async (req, res) => {
        const email = req.query.email
        const query = { applicant_email: email }
        const result = await JobApplication.find(query).toArray()

        // fokira away add data
        for (const application of result) {
            console.log(application.job_id)
            const query1 = { _id: new ObjectId(application.job_id) }
            const job = await JobCollection.findOne(query1)
            if (job) {
                application.title = job.title;
                application.company = job.company;
                application.company_logo = job.company_logo;
                application.location = job.location;
            }
        }

        res.send(result)
    })

    app.get('/job-applications/jobs/:job_id', async(req, res) => {
        const jobId = req.params.job_id;
        const query = { job_id: jobId }
        const result = await JobApplication.find(query).toArray();
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
