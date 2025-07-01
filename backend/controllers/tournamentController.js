const Tournament = require('./models/torunamentModel');
const Match = require('./models/matchModel');
const User = require('./models/userModel');
const Team = require('./models/teamModel');

//Creare un torneo
exports.createTournament = async (req, res) => {
    try {
        const {
            name, isPrivate, startDate, endDate,type, location, deadline, description, prize, quotaIscrizione, maxTeams
        } = req.body;
        const userId = req.userId;

        if (!name || !startDate || !endDate || !deadline || !prize || !maxTeams) {
            return res.status(400).json({ message: "Tutti i campi obbligatori devono essere compilati." });
        }

        const newTournament = new Tournament({
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
            createdAt: new Date(),
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
        const tournamentId = req.params.id;

        const tournament = await Tournament.findById(tournamentId);
        if(!tournament){
            return res.status(400).json({message: "Torneo non trovato"});
        }
        //Verifico se l'utente è il creatore del torneo
        if(tournament.createdBy.toString() !== userId){
            return res.status(403).json({ message: "Utente non autorizzato ad eliminare questo post!"});
        }

        await Tournament.findByIdAndDelete(tournamentId);
        res.status(200).json({message: "Torneo eliminato con successo"});

    } catch(error){
        console.error("Errore eliminazione torneo:", error);
        res.status(500).json({message: "Errore del server durante l'eliminazione del torneo"});
    }
}

//Aggiornare un torneo
exports.updateTournament = async (req,res) => {
    try{
        const tournamentId = req.params.id;
        const userId = req.userId;
        const updates = req.body;

        const tournament = await Tournament.findById(tournamentId);

        if(!tournament){
            return res.status(400).json({message: "Torneo non trovato"});
        }

        if(tournament.createdBy.toString() !== userId){
            return res.status(403).json({message: "Non sei autorizzato a modifcare il torneo!"});
        }

        if (['In corso', 'Completato'].includes(tournament.status)) {
            return res.status(400).json({message: "Non puoi modificare un torneo in corso"});
        }

        const modifiche = [ "location", "startDate", "endDate", "deadline", "description", "prize", "quotaIscrizione", "maxTeams" ];
        modifiche.forEach( field => {
            if (updates[field] !== undefined){
                tournament[field] = updates[field];
            }
        })


        await tournament.validate();
        const updatedTournament = await tournament.save();
        const populatedTournament = await Tournament.findById(updatedTournament._id).populate('createdBy', 'username');

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
        query.startDate = { $gte: parsedDate, $lt: nextDay };
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
            query.quotaIscrizione = { $gt: 0}; // tornei gratis
        } else if (quotaIscrizione === "false") {
            query.quotaIscrizione = 0; // tornei a pagamento
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
        const { tournamentId} = req.params;
        const { teamName } = req.body;

        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            return res.status(404).json({message: "Torneo non trovato"});
        }
        if (tournament.status !== 'In attesa') {
            return res.status(400).json({ message: "Iscrizioni chiuse per questo torneo" });
        }

        if(new Date(tournament.deadline) < new Date() ) {
            return res.status(400).json({message: "Termine per le iscrizioni scaduto"});
        }

        if(tournament.isPrivate){
            return res.status(403).json({message: "Torneo privato: iscrizione su invito"});
        }

        if(tournament.teams.length >= tournament.maxTeams){
            return res.status(400).json({message: "Numero massimo di squadre raggiunto"});
        }

        const alreadyTeamName = await Team.findOne({
            _id: { $in: tournament.teams },
            name: teamName.toLowerCase()
        });
        if (alreadyTeamName) {
            return res.status(400).json({ message: "Nome squadra già utilizzato in questo torneo" });
        }

        const userTeams = await Team.find({ captain: userId });
        const isAlreadyRegistered = tournament.teams.some(teamId =>
            userTeams.some(userTeam => userTeam._id.equals(teamId))
        );
        if(isAlreadyRegistered){
            return res.status(403).json({message: "Hai già iscritto una squadra"});
        }

           const  newTeam = new Team({
                name: teamName.toLowerCase(),
                captain: userId,
                paymentStatus: tournament.quotaIscrizione ? "In attesa" : "Pagato",
                createdAt : new Date(),
            });
            await newTeam.save();



        tournament.teams.push(newTeam._id);

        if (tournament.teams.length === tournament.maxTeams) {
            tournament.status = 'Iscrizioni chiuse';
        }

        await tournament.save();

        // Popola i dati per la risposta
        const updatedTournament = await Tournament.findById(tournamentId)
            .populate({
                path: 'teams',
                select: 'name captain paymentStatus'
            });

        res.status(200).json({
            message: "Iscrizione avvenuta con successo",
            tournament: updatedTournament,
            team: newTeam
        });

    }catch (error) {
        console.error("Errore durante l'iscrizione al torneo:", error);
        res.status(500).json({ message: "Errore del server" });
    }
};