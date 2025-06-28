const Tournament = require('./models/torunamentModel');
const Model = require('./models/matchModel');

//Crea un torneo
exports.createTournament = async (req, res) => {
    try {
        const {
            name, isPrivate, startDate, endDate, location, deadline, description, prize, quotaIscrizione, maxTeams, createdAt
        } = req.body;
        const userId = req.userId;

        if (!name || !startDate || !endDate || !deadline || !prize || !maxTeams) {
            return res.status(400).json({ message: "Tutti i campi obbligatori devono essere compilati." });
        }

        const newTournamnet = new Tournament({
            name,
            isPrivate,
            startDate,
            endDate,
            location,
            deadline,
            description,
            prize,
            quotaIscrizione,
            maxTeams,
            createdAt,
            createdBy: userId,
        });

        await newTournament.save();
        //Genera tabbellone vuoti
        await generateBracket(newTournamnet);
        const populatedTournament = await Tournament.findById(newTournament._id).populate('createdBy', 'name');

        res.status(201).json({
            message : "Torneo creato con successo",
            tournament: populatedTournament,
        });
    } catch(error){
        console.log("Errore creazione torneo:", error)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join('. ') });
        }
        res.status(500).json({ message: "Errore del server durante la creazione del torneo." });
    }
}