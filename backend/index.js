require('dotenv').config(); //x dare valore a .env
const express = require('express');
const cors = require('cors');


const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

const port = process.env.PORT || 3000;
app.use(cors()); //Permette al tuo server di rispondere alle richieste provenienti da altri domini/origini.
app.use(express.json()); //capire il corpo (body) delle richieste HTTP che arrivano in formato JSON.

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connesso a MongoDB');
        app.listen(process.env.PORT, () => {
            console.log(`Server avviato sulla porta ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log('Errore connessione MongoDB:', err);
    });


//se avessi voluto usare async/await
// async function startServer(){
// try{
// await mongoose.connect(process.env.MONGO_URI);
//      console.log('Connesso a MongoDB');
//  app.listen( process.env.PORT, (){
//      console.log('Il server avviato su porta ${process.env.PORT}');
//      });
//  }catch (errore){
//         console.log('Errore di connessione a mongoDB:' , errore);
//      }
//    }
//      startServer();
