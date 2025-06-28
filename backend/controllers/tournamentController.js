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


//Cerca tornei x nome,data,luogo, tipo, privato, gratis/pagamento, numero squadre
exports.searchTournament = async (req, res) => {
try {
    const { name, location, date, type, isPrivate, quotaIscrizione, maxTeams } = req.query;
    const query = {};

    // Cerca x nome
    if (name) {
        query.name = { $regex: name, $options: "i" };
    }

    // Cerca per luogo
    if (location) {
        query.location = { $regex: location, $options: "i" };
    }

    // cerca x data
    if (date) {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) {
            return res.status(400).json({ message: "Data non valida" });
        }
        const nextDay = new Date(parsedDate);
        nextDay.setDate(parsedDate.getDate() + 1);
        query.date = { $gte: parsedDate, $lt: nextDay };
    }

    // cerca x tipo
    if (type) {
        query.type = { $regex: type, $options: "i" };
    }

    // Cerca per privato/pubblico
    if (isPrivate !== undefined) {
        if (isPrivate === "true") {
            query.isPrivate = true; //privato
        } else if (isPrivate === "false") {
            query.isPrivate = false; //pubblico
        } else {
            return res.status(400).json({ message: "Tipo torneo non trovato" });
        }
    }

    // Cerca per gratis o pagamento
    if (quotaIscrizione !== undefined) {
        if (quotaIscrizione === "true") {
            query.quotaIscrizione = 0; // tornei gratis
        } else if (quotaIscrizione === "false") {
            query.quotaIscrizione = { $gt: 0 }; // tornei a pagamento
        } else {
            return res.status(400).json({ message: "Quota non trovata" });
        }
    }

    // cerca per numero di squadre
    if (maxTeams) {
        const max = Number(maxTeams);
        if (isNaN(max)) {
            return res.status(400).json({ message: "Numero squadre non trovato" });
        }
        query.maxTeams = { $gte: max };
    }

    const tournaments = await Tournament.find(query);

    if (tournaments.length === 0) {
        return res.status(404).json({ message: "Nessun torneo trovato con i seguenti filtri" });
    }

    res.status(200).json(tournaments);

} catch (error) {
    console.error("Errore durante la ricerca del torneo:", error);
    res.status(500).json({ message: "Errore del server" });
}
};

//Iscrizione torneo
exports.joinTournament = async (req, res) => {
    try{
        const userId = req.userId;
        const { tournamentName, teamName } = req.params;

        const tournament = await Tournament.findOne({name: tournamentName});
        if (!tournament) {
            return res.status(404).json({message: "Torneo non trovato"});
        }

        const team = await Team.findOne({name: teamName});
        if (!team) {
            return res.status(404).json({message: "Squadra non trovata"});
        }

        if(tournament.teams.includes(team._id)){
            return res.status(400).json({message: "Squadra già iscritta al torneo"});
            }

        if(tournament.teams.length >= tournament.maxTeams){
            return res.status(400).json({message: "Numero massimo di squadre raggiunto"});
        }

        tournament.team.push(team._id);
        await tournament.save();

        res.status(200).json({message:"Iscrizione avvenuta con successo", torneo: tournament});

    }catch (error) {
        console.error("Errore durante l'iscrizione al torneo:", error);
        res.status(500).json({ message: "Errore del server" });
    }
};