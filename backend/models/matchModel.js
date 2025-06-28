const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    tournament: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament',
        required: [true, "il nome del torneo è obbligatorio"],
    },
    game: {
        type: String,
        required: [true, "La fase del torneo è obbligatoria"],
        enum: ['Sedicesimi', 'Ottavi', 'Quarti', 'Semifinale', 'FInale', 'Giorni'],
    },
    teamHome: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    teamAway: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    scoreHome: {
        type: Number,
        min: 0,
        default: 0,
    },
    scoreAway: {
        type: Number,
        min: 0,
        default: 0,
    },
    status: {
        type: String,
        default: 'In programma',
        enum: ['In programma', 'In corso', 'Terminata'],
    },
    date:{
        type: Date,
        required: true,
    },
    })

module.exports = mongoose.model('match' , matchSchema);