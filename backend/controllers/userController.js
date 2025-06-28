const mongoose = require('mongoose');
const user = require('../models/userModel.js');


//registrazione
exports.createUser= async (req, res, next)=>{
    try{
        const {email, username, password} = req.body;
        let exist = false;
        const existingUser = await user.findOne({email})
        if(existingUser){
            exist = true;
            res.status(404).send({error: ' l\' email è già stata utilizzata'})
        }
        const newUser = new user({email, username, password})
        await newUser.save()

        res.status(200).send({message: 'utente creato correttamente'}).json({
            status: 'success',
            //token,
            data: {
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    isOrganizer: user.isOrganizer
                }
            }
        })

        //va capito next(), va inserito token jwt e cookie per la sessione
        next()
    }catch(err){
        res.status(400).send({message: 'errore nel login, riprovare'})
        next(err)
    }


}

//login
exports.login = async (req, res, next)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            res.status(400).send({error: 'Tutti i campi sono obbligatori'});
        }

        const findUser = await user.findOne({email: email}).select('+password')
        const rightPassword = await user.comparePassword(password);
        if(!findUser || !rightPassword){
            res.status(400).send({message: 'email o password errati'})
        }
        res.status(200).send({message: 'login eseguito correttamente'}).json({
            status: 'success',
            //token,
            data: {
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    isOrganizer: user.isOrganizer
                }
            }
        })
        next()
        //va capito next(), va inserito token jwt e cookie per la sessione
    }catch(err){
        res.status(400).send({message: 'errore nel login, riprovare'})
    }
}

//logout
exports.logout = async (req, res)=>{
    try{
        //si fa solo con jwt e cookie
    }catch{

    }
}

//metodo che serve per l'area personale per fare comparire i propri dati

exports.getMe = async function(req, res, next){
    try{
        const id = req.body._id;
        const me = await user.findById(id).populate('tournamentsOrganized').populate('team.tournaments.tournament');
        if(!me){
            res.status(404).send({error: 'dati non trovati'})
        }
        const hasNoTournaments =
            user.teams.every(team => team.tournaments.length === 0);

        const hasNoTournamentsOrganized = user.tournamentsOrganized.length === 0
        if(!hasNoTournaments){
            res.json({message: 'Non hai ancora partecipato a nessun torneo!'})
        }

        if(!hasNoTournamentsOrganized){
            res.json({message: 'Non hai ancora organizzato nessun torneo!'})
        }


        res.status(200).json({status: 'success', data: {me}})
        next()
    }catch(err){
        res.status(400).send({message: 'errore nella ricerca, riprovare'})
    }

    //si potrebbe aggiungere un campo per modificare alcuni dati dell'utente come la password, ma per la modifica della password bisogna ancora capire bene
}
