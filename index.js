const express = require("express");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8000;
const uri = process.env.MONGO_URI;

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
);
 
const verifyToken = async (req, res, next) => {
  const authHeader = req?.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const { payload } = await jwtVerify(token, JWKS);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden" });
  }
};
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    const db = client.db("DocAppoint");
    const doctorCollection = db.collection("doctors");
    const appointmentsCollection = db.collection("appointments");

    app.get("/doctors", async (req, res) => {
      const result = await doctorCollection.find().toArray();
      res.json(result);
    });

    app.get("/doctors/:id", verifyToken, async (req, res) => {
      const { id } = req.params;
      const result = await doctorCollection.findOne({ _id: new ObjectId(id) });
      res.json(result);
    });

    app.post("/appointments",verifyToken, async (req, res) => {
      const appointment = req.body;
      const result = await appointmentsCollection.insertOne(appointment);
      res.json(result);
    });

    app.get("/appointments", async (req, res) => {
      const { email } = req.query;
      const query = email ? { userEmail: email } : {};
      const result = await appointmentsCollection.find(query).toArray();
      res.json(result);
    });

    app.patch("/appointments/:id",verifyToken, async (req, res) => {
      const { id } = req.params;
      const result = await appointmentsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: req.body },
      );
      res.json(result);
    });

    app.delete("/appointments/:id",verifyToken, async (req, res) => {
      const { id } = req.params;
      const result = await appointmentsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    app.patch("/doctors/:id/review",verifyToken, async (req, res) => {
    const { id } = req.params;
    const { rating, comment, userName, userEmail } = req.body;

    const doctor = await doctorCollection.findOne({ _id: new ObjectId(id) });
    const newRating = parseFloat(((doctor.rating + rating) / 2).toFixed(1));
    const newTotalReviews = doctor.totalReviews + 1;

    const result = await doctorCollection.updateOne(
        { _id: new ObjectId(id) },
        {
            $set: { rating: newRating, totalReviews: newTotalReviews },
            $push: { reviews: { userName, userEmail, rating, comment, date: new Date().toISOString() } },
        }
    );
    res.json(result);
});

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
