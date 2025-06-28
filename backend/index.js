const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const cookieParser = require("cookie-parser");
const app = express();
const userRoute = require('./routes/userRoute');
require('dotenv').config();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000; //porta 3000 di default

app.use(express.json())
app.use(express.urlencoded({ extended: true })) //per le richieste URL-encoded (vedere se serve)
app.use(cookieParser()) // per fare il parsing dei cookie, ovvero prendere i cookie presenti in una richiesta http e trasformarli in oggetti javascript

//routes

app.use('/api/user', userRoute)

// colleghiamo il database
mongoose.connect(process.env.CONNECTION_LINK)
const db = mongoose.connection

// Apriamo una connessione con il database e mettiamo il server in ascolto
db.once('open', () => server.listen(PORT, () => console.log(`App connessa al DB e in ascolto sulla porta ${process.env.PORT}`))
)