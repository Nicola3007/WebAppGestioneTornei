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
        validate: {
            validator: function(date) {
                return date > new Date();
            },
            message: 'La data di inizio deve essere futura'
        }
    },
    endDate : {
        type: Date,
        required: true,
        validate: {
            validator: function(date) {
                return date > this.startDate;
            },
            message: 'La data di fine deve essere successiva alla data di inizio'
        }
    },
    location: {
        type: String,
        trim: true,
        maxlength: [100, 'La località non può superare i 100 caratteri']
    },
    deadline : {
        type: Date,
        required: true,
        validate: {
            validator: function(date) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date > today && date < this.startDate;
            },
            message: 'La scadenza iscrizioni deve essere compresa tra oggi e la data di inizio'
        }
    },
    description : {
        type: String,
        default: '',
        maxLength : [300 , "La descrizione non può superare i 300 caratteri"]
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
        min: 0,
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
    teams: [{
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
        }
        }],
    matches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match'
    }],
})

tournamentSchema.pre('validate', async function (next) {    try {
        const oggi = new Date();
        oggi.setHours(0, 0, 0, 0);

        if (this.isModified('startDate') && this.startDate < oggi) {
            this.invalidate('startDate', 'La data di inizio deve essere futura');
        }

        if (this.isModified('endDate') && this.endDate <= this.startDate) {
            this.invalidate('endDate', 'La data di fine deve essere successiva alla data di inizio');
        }

        if (this.isModified('deadline') && (this.deadline <= oggi || this.deadline >= this.startDate)) {
            this.invalidate('deadline', 'La scadenza iscrizioni deve essere compresa tra oggi e la data di inizio');
        }

        next();
    } catch (error) {
        next(error);
    }
    });

module.exports = mongoose.model('Tournament', tournamentSchema);
