const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "L'username è obbligatorio"],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "L'email è obbligatoria"],
        unique: true,
        lowercase: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Inserisci un'email valida (es. nome@dominio.com)"
        ]
    },
    password: {
        type: String,
        required: [true, "L'password è obbligatoria"],
        minlength: [8, "la password deve avere almeno 8 caratteri"],
        select: false
    },
    //teams sono tutte le squadre create e di conseguenza tutti i tornei a cui si ha partecipato
    teams: [{
        name:{
            type: String,
            required: true,
        },
        tournament: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tournament',
            required: true
        }
    }]

})


//middleware pre-save per hashare la password alla creazione di un nuovo utente (o alla modifica della password)

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        return next(); //va avanti se la password non è stata modificata
    }
    try{
        const salt = await bcrypt.genSalt(10); //genera una stringa casuale di complessità 10
        this.password = await bcrypt.hash(this.password, salt); //funzione per l'hashing della password
        next()
    }catch(err){
        next(err);
    }
})
//funzione per comparare le password criptate
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
