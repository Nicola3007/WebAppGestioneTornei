const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    name :{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    isPrivate :{
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        required: true,
        enum : ["Girone all'italiana" , "Gironi + Fase ad eliminazione diretta", 'Eliminazione diretta'],
        default: 'Eliminazione diretta',
    },
    startDate : {
        type: Date,
        required: true,
    },
    endDate : {
        type: Date,
        required: true,
    },
    location: {
        type: String,
    },
    deadline : {
        type: Date,
        required: true,
    },
    description : {
        type: String,
        default: '',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    prize: {
        type: String,
        required: true,
    },
    quotaIscrizione: {
        type: Number,
    },
    maxTeams: {
        type: Number,
        required: true,
        enum: [4, 8, 16, 32],
    },
    status: {
        type: String,
        default: 'In attesa',
        enum : ['In attesa', 'Iscrizioni chiuse', 'In corso', 'Completato'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    teams: [
        {
            teamName: {
                type: String, // Nome della squadra
                required : true,
                trim: true,
                lowercase: true,
                unique: true,
            },
            Capitain: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            paymentStatus: {
                type: String,
                enum: ['pending', 'paid', 'rejected'],
                default: 'pending'
            }
        }
    ],
    matches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match'
    }],
})

tournamentSchema.pre('validate', async function (next) {

    try {
        const oggi = new Date();
        oggi.setHours(0, 0, 0, 0);

        if (this.startDate < oggi) {
            this.invalidate('startDate', 'la data di inzio deve essere valida!')
        }
        if (this.endDate && this.startDate && this.endDate <= this.startDate) {
            this.invalidate('endDate', 'la data di fine deve essere valida!')
        }
        if (this.deadline && (this.deadline <= oggi || this.deadline >= this.startDate)) {
            this.invalidate('deadline', 'la data di chiusura iscrizioni deve essere valida!')
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Tournament', tournamentSchema);
