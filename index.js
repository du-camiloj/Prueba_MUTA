const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
const materialRoutes = require('./routes/material.route');
const collectionRoutes = require('./routes/collection.route');
const userRoutes = require('./routes/user.route');

app.use(cors());
app.use(express.json());
app.use(materialRoutes);
app.use(collectionRoutes);
app.use(userRoutes);

const port = process.env.PORT || 3000;

app.get('*', (req, res) => res.status(200).send({
  message: 'Valeria y Kiwi los amo mucho',
}));

app.listen(port, () => {
  console.log('App is now running at http://localhost:'+ port)
})