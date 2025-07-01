const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    captain : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pagato', 'In attesa', 'Rifiutato'],
        default: 'In attesa'
    },
    });

module.exports = mongoose.model('Team', teamSchema);
