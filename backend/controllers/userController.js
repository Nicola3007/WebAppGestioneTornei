const mongoose = require('mongoose');
const user = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const refreshToken = require('../models/refreshTokenModel.js');
require('dotenv').config();

//funzione helper per la generazione di token
const generateToken = (userId)=>{
    // creazione JWT token
    const accessToken = jwt.sign(
        {'userId': userId},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '30s'})//qua inserisco il payload contenente i dati che devono essere salvati nel token, il codice segreto generato casualmente e la scadenza (30s è troppo poco, circa 15 min)
    const refreshToken = jwt.sign(
        {'userId': userId},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '7d'})//qua inserisco il payload contenente i dati che devono essere salvati nel token, il codice segreto generato casualmente e la scadenza ( 7 giorni è un tempo medio)
    return {accessToken, refreshToken}
}

//REGISTRAZIONE
exports.createUser= async (req, res, next)=>{
    try{
        const {username, email, password} = req.body;
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
            data: {
                user: {
                    username: username,
                    email: email,
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

//LOGIN
exports.login = async (req, res, next)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            res.status(400).send({error: 'inserire tutti i dati'});
        }

        const findUser = await user.findOne({email: email}).select('+password')
        const rightPassword = await user.comparePassword(password);
        if(!findUser || !rightPassword){
            res.status(400).send({message: 'email o password errati'})
        }

        const {accessToken, refreshToken} = generateToken(findUser._id);
        console.log(`[LOGIN] Salvataggio refresh token nel DB: ${refreshToken} per utente ${findUser._id}`); //log per il debug
        await refreshToken.create({ token: refreshToken, userId: findUser._id }); //salvataggio del refresh token nel db per il controllo e l'eventuale creazione di access token

        //inviamo il refreshToken come cookie httpOnly, perchè inviarlo come cookie normale potrebbe renderlo vulnerabile agli attacchi

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'Strict', maxAge: 7*24*60*60*1000 }) /* creiamo un cookie inserendo nome del cookie, valore inserito e delle opzioni
                                                                                                            tra cui httpOnly (per renderlo non disponibile a javascript e quindi più sicuro),
                                                                                                            sameSite che a prevenire CSRF e maxAge per quando scade(in ms) */

        res.status(200).send({message: 'login eseguito correttamente'}).json({
            status: 'success',
            accessToken: accessToken, //una volta inviato nel frontend ci deve essere un meccanismo per salvarlo, preferibilmente in memoria
            data: {
                user: {
                    _id: findUser._id,
                    username: findUser.username,
                    email: findUser.email,
                    isOrganizer: findUser.isOrganizer
                }
            }
        })
        next()
        //va capito next(), va inserito token jwt e cookie per la sessione
    }catch(err){
        res.status(400).send({message: 'errore nel login, riprovare'})
    }
}

//LOGOUT
exports.logout = async (req, res)=>{
    //nel frontend va eliminato l'accesso token
    const cookies = req.cookies
    const refreshTokenCookie = cookies.jwt
    if(!cookies?.jwt) return res.status(204).json({message: 'refresh token non trovato'})
    try{
        //rimuoviamo il refresh token dal db
        await refreshToken.deleteOne({token: refreshTokenCookie})

        //puliamo il cookie

        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'Strict'
        })

        res.status(200).send({message: 'logout effettuato con successo'})


    }catch{
        res.status(500).json({message: 'errore nel server'})
    }
}

// GETME: metodo che serve per l'area personale per fare comparire i propri dati
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


