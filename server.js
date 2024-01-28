const express = require('express');
const app = express();
app.set('view engine', 'ejs')
app.use(express.static('public'))
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://quoty:sfsfs345@cluster0.3xi35dd.mongodb.net/?retryWrites=true&w=majority";
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
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");
  } finally {
  }
}

const db = client.db('CRUD');
const quotesCollection = db.collection('quotes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // This is used for parsing JSON bodies.

app.post('/quotes', (req, res) => {
  quotesCollection
    .insertOne(req.body)
    .then(result => {
      console.log(result);
      res.redirect('/');
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});

app.get('/', (req, res) => {
  db.collection('quotes')
    .find()
    .toArray()
    .then(results => {
      res.render('index.ejs', { quotes: results })
    })
    .catch(error => console.error(error))
})

app.put('/quotes', (req, res) => {
  quotesCollection
  .findOneAndUpdate(
    { name: 'Yoda' },
    {
      $set: {
        name: req.body.name,
        quote: req.body.quote,
      },
    },
    {
      upsert: true,
    }
  )
  .then(result => {
    res.json('Success')
  })
 .catch(error => console.error(error))
})


app.listen(3000, function () {
  console.log('listening on 3000')
})