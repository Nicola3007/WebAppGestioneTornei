const express = require('express');
const route = express.Router();
const tournamentController = require('../controllers/tournamentController')
const verifyToken = require('../middlewares/verifyJWT')


route.post('/createTournament',verifyToken, tournamentController.createTournament)
route.post('/updateTournament/:id',verifyToken, tournamentController.updateTournament)
route.delete('/deleteTournament/:id', verifyToken, tournamentController.deleteTournament)
route.get('/search', tournamentController.searchTournament)
route.post('/subscribeTeam/:tournamentId', verifyToken, tournamentController.joinTournament)
route.get('/signedUpTournaments', verifyToken, tournamentController.getMySignedUpTournaments)

module.exports = route;