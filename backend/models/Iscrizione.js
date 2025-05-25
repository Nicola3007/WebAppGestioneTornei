const mongoose = require('mongoose');

const iscrizioneSchema = new mongoose.Schema({
    nomeSquadra: {
        type: String,
        required: [true, 'Il nome della squadra è obbligatorio'],
        trim: true,
    },
    capoGruppo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utente',
        required: true,
    },
    torneo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Torneo',
        required: true,
    },
    statoPagamento: {
        type: String,
        enum: ['non_pagato', 'in_attesa', 'pagato', 'fallito'],
        default: 'non_pagato',
    },
    dataIscrizione: {
        type: Date,
        default: Date.now,
    },
    });

module.exports = mongoose.model('Iscrizione', iscrizioneSchema);