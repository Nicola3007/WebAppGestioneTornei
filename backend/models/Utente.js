const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const utenteSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "L'username è obbligatoria"],
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [5, "La lunghezza minima è di 5 caratteri"],
    },
    email: {
        type: String,
        required: [true, "L'email è obbligatoria"],
        unique: true,
        trim: true,
        lowercase: true,
        // Regex semplice per validazione email
        match: [/\S+@\S+\.\S+/, "L'email non è valida"],
    },
    password: {
        type: String,
        required: [true, "La password è obbligatoria"],
        minlength: [8, "La password deve essere di almeno 8 caratteri"],
    },
    bio : {
        type: String,
        default: '',
    },
    iscrizioni: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Iscrizione',
    }],
})

// Middleware pre-save per hashare la password prima di salvarla
utenteSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        return next();
    }
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }catch(error){
        next(error);
    }
});

// Metodo per confrontare la password inserita con quella hashata nel DB
utenteSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Utente', utenteSchema);