const Tournament = require('./models/torunamentModel');
const Match = require('./models/matchModel');
const User = require('./models/userModel');

//Creare un torneo
exports.createTournament = async (req, res) => {
    try {
        const {
            name, isPrivate, startDate, endDate,type, location, deadline, description, prize, quotaIscrizione, maxTeams, createdAt
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
            type,
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
        switch (newTournament.type) {
            case 'Eliminazione diretta':
                await generateTabellone(newTournament);
                break;
            case "Girone all'italiana":
                await generateGironi(newTournament);
                break;
            case 'Gironi + Fase ad eliminazione diretta':
                await generateChampions(newTournament);
                break;
        }
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

//Eliminare un torneo
exports.deleteTournament = async (req,res) => {
    try{
        const userId = req.userId;
        const tournamentName = req.params.tournamentName;

        const tournament = await Tournament.findOne({ name : tournamentName});
        if(!tournament){
            return res.status(400).json({message: "Torneo non trovato"});
        }
        //Verifico se l'utente è il creatore del torneo
        if(tournament.createdBy.toString() !== userId){
            return res.status(403).json({ message: "Utente non autorizzato ad eliminare questo post!"});
        }

        await Tournament.deleteOne({ name: tournamentName});
        res.status(200).json({message: "Torneo eliminato con successo"});

    } catch(error){
        console.error("Errore eliminazione torneo:", error);
        res.status(500).json({message: "Errore del server durante l'eliminazione del torneo"});
    }
}

//Aggiornare un torneo
exports.updateTournament = async (req,res) => {
    try{
        const tournamentName = req.params.tournamentName;
        const userId = req.userId;
        const {location, startDate, endDate, deadline,description, prize, quotaIscrizione ,maxTeams} = req.body;

        const tournament = await Tournament.findOne({name: tournamentName});

        if(!tournament){
            return res.status(400).json({message: "Torneo non trovato"});
        }

        if(tournament.createdBy.toString() !== userId){
            return res.status(403).json({message: "Non sei autorizzato a modifcare il torneo!"});
        }

        if(tournament.createdBy.toString() == userId) {
            if (['In corso', 'Completato'].includes(tournament.status)) {
                return res.status(400).json({message: "Non puoi modificare un torneo in corso"});
            }
        }

        if(location !== undefined){
            tournament.location = location;
        }
        if(startDate !== undefined){
            tournament.startDate = startDate;
        }
        if(endDate !== undefined){
            tournament.endDate = endDate;
        }
        if(deadline !== undefined){
            tournament.deadline = deadline;
        }
        if(description !== undefined){
            tournament.description = description;
        }
        if(prize !== undefined){
            tournament.prize = prize;
        }
        if(quotaIscrizione !== undefined){
            tournament.quotaIscrizione = quotaIscrizione;
        }
        if(maxTeams !== undefined){
            tournament.maxTeams = maxTeams;
        }


        const updatedTournament = await tournament.save();
        const populatedTournament = await Tournament.findOne({name: updatedTournament.name}).populate('createdBy', 'username');

        res.json({ message: "Torneo aggiornato con successo!", tournament: populatedTournament });


    }catch(error){
        console.error("Errore aggiornamento torneo:", error);
        res.status(500).json({message: "Errore del server"});
    }}