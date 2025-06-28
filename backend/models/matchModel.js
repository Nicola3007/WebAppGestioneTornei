const mongoose = require('mongoose');

const matchModelSchema = new mongoose.Schema({
    tournament: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament',
        required: true,
    },
    game: {
        type: String,
        required: true,
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
        default: 0,
    },
    scoreAway: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        default: 'In programma',
        enum: ['In programma', 'In corso', 'Terminata'],
    },
})



module.exports = mongoose.model('matchModel' , matchModelSchema);