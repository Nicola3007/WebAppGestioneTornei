const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    name :{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    type: {
        type: String,
        required: true,
        enum : ["Eliminazione diretta", "Girone all'italiana", "Altro"],
        default: 'Eliminazione diretta',
    },
    startDate : {
        type: Date,
        required: true
        },
    endDate : {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        trim: true,
        maxlength: [100, 'La località non può superare i 100 caratteri']
    },
    deadline : {
        type: Date,
        required: true,
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
        }
        }]
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
