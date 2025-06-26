const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const app = express();
require('dotenv').config();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000; //porta 5000 di default

app.use(express.json())


// colleghiamo il database
mongoose.connect(process.env.CONNECTION_LINK)
const db = mongoose.connection

// Apriamo una connessione con il database e mettiamo il server in ascolto
db.once('open', () => server.listen(PORT, () => console.log(`App connessa al DB e in ascolto sulla porta ${process.env.PORT}`))
)