const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://rezoansarwar:TThrLcBbOSWgrxYi@cluster0.ickg6fx.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const database = client.db("firstDB");
    const userInformation = database.collection("userInformation");

    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = userInformation.find(query);
      const userList = await cursor.toArray();
      res.send(userList);
    });

    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userInformation.findOne(query);
      res.send(result);
      console.log(result);
    });

    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
        },
      };
      const result = await userInformation.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
      console.log(result);
    });

    app.post("/users", async (req, res) => {
      const addUsers = req.body;
      const result = await userInformation.insertOne(addUsers);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userInformation.deleteOne(query);
      res.send(result);
      console.log(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port);
