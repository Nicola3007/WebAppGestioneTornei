const Match = require('./models/matchModels');
const Tournament = require('./models/tournamentModel');
const User = require('./models/userModel');


//creo un match
exports.createMatch = async (req, res) => {
    try{
        const { teamHome, teamAway, tournament, game, scoreHome = 0, scoreAway=0, status= 'In programma', date} = req.body
        const userId = req.userId;

        if (!teamHome || !teamAway || !tournament || !game || !date) {
            return res.status(400).json({ message: "Inserire tutti i campi obbligatori!" });
        }

        if (teamHome === teamAway) {
            return res.status(400).json({ message: "Le squadre devono essere diverse." });
        }

        const tournamentData = await Tournament.findById(tournament);

        if (!tournamentData) {
            return res.status(404).json({ message: "Torneo non trovato" });
        }

        if (tournamentData.createdBy.toString() !== userId) {
            return res.status(403).json({ message: "Non sei autorizzato a creare match in questo torneo." });
        }
        // Verifica che le squadre siano iscritte
        if (!tournamentData.teams.some(team => team.teamName === teamHome)) {
            return res.status(400).json({ message: `La squadra ${teamHome} non è iscritta al torneo!` });
        }

        if (!tournamentData.teams.some(team => team.teamName === teamAway)) {
            return res.status(400).json({ message: `La squadra ${teamAway} non è iscritta al torneo!` });
        }


        const newMatch = new Match({
                tournament,
                teamHome,
                teamAway,
                game,
                scoreHome,
                scoreAway,
                status,
                date,
            });

        await newMatch.save()

        const populatedMatch = await Match.findById(newMatch._id)
            .populate('teamHome', 'name')
            .populate('teamAway', 'name')
            .populate('tournament', 'name');


        res.status(201).json({message: "Match creato con succsso!", match: populatedMatch});
    }catch(error){
        console.error("Errore del server: ",error);
        return res.status(400).json({message:"Errore del server durante la careazione del match."});
    }
}