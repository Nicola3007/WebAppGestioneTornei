const mongoose = require('mongoose');

const partitaSchema = new mongoose.Schema({
    torneo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Torneo',
        required: true,
    },
    squadraA: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Iscrizione',  // riferimento a iscrizione (la "squadra")
        required: true,
    },
    squadraB: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Iscrizione',
        required: true,
    },
    fase: {
        type: String,
        enum: ['sedicesimi', 'ottavi', 'quarti', 'semifinale', 'finale'],
        default: 'girone',
    },
    vincitore: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Iscrizione',
        default: null,
    },
    punteggioA: {
        type: Number,
        default: 0,
    },
    punteggioB: {
        type: Number,
        default: 0,
    },
    dataPartita: {
        type: Date,
        required: true,
    },
    risultatoInserito: {
        type: Boolean,
        default: false,
    },
    note: {
        type: String,
        default: '',
    },
});

module.exports = mongoose.model('Partita', partitaSchema);