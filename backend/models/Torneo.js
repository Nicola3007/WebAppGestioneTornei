const mongoose = require('mongoose');

const torneoSchema = new mongoose.Schema({
    nome: {
        type: String,
        unique: true,
        required: [true, "Il nome del torneo è obbligatorio"],
        trim: true,
    },
    descrizione: {
        type: String,
        required: [true, "La descrizione del torneo è obbligatoria"],
        trim: true,
    },
    dataInizio: {
        type: Date,
        required: [true, "La data di inizio è obbligatoria"],
    },
    dataFine: {
        type: Date,
        required: [true, "La data di fine è obbligatoria"],
    },
    statoTorneo: {
        type: String,
        enum: ['aperto', 'in corso', 'chiuso'],
        default: 'aperto',
    },
    creatore: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utente',
        required: true,
    },
    Iscrizioni: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Iscrizione',
    }],
    vincitore: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Iscrizione',
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    pagamentoRichiesto: {
        type: Boolean,
        default: false,
    },
    quotaIscrizione: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model('Torneo', torneoSchema);