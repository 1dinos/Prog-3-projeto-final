const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { CosmosClient } = require("@azure/cosmos");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = new CosmosClient({ endpoint: process.env.COSMOS_ENDPOINT, key: process.env.COSMOS_KEY });
const database = client.database("functions");
const container = database.container("teste");

app.get('/items', (req, res) => {
  res.json([
    { id: 1, name: 'Test Item A' },
    { id: 2, name: 'Test Item B' },
    { id: 3, name: 'Dinis' }
  ]);
});

app.get('/items', async (req, res) => {
  const { resources: items } = await container.items.readAll().fetchAll();
  res.send(items);
});

app.post('/items', async (req, res) => {
  const { resource: createdItem } = await container.items.create(req.body);
  res.status(201).send(createdItem);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/ping', (req, res) => {
  res.send('pong');
});