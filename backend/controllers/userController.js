const mongoose = require('mongoose');
const user = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/refreshTokenModel.js');
const Team = require('../models/teamModel.js');
require('dotenv').config();

//funzione helper per la generazione di token --> corretta
const generateToken = (userId)=>{
    // creazione JWT token
    const accessToken = jwt.sign(
        {'userId': userId},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '15m'})//qua inserisco il payload contenente i dati che devono essere salvati nel token, il codice segreto generato casualmente e la scadenza (30s è troppo poco, circa 15 min)
    const refreshToken = jwt.sign(
        {'userId': userId},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '7d'})//qua inserisco il payload contenente i dati che devono essere salvati nel token, il codice segreto generato casualmente e la scadenza ( 7 giorni è un tempo medio)
    return {accessToken, refreshToken}
}

//REGISTRAZIONE--> corretta
exports.createUser= async (req, res)=>{
    try{
        const {username, email, password} = req.body;
        let exist = false;
        const existingUser = await user.findOne({email})
        if(existingUser){
            exist = true;
            return res.status(404).json({message: ' l\' email è già stata utilizzata'})
        }
        const newUser = new user({email, username, password})
        await newUser.save()

        res.status(200).json({
            status: 'success',
            message: 'Utente creato correttamente',
            data: {
                user: {
                    username: username,
                    email: email,
                }
            }
        })

    }catch(err){
       return res.status(500).json({message: 'errore nella registrazione, riprovare'})
    }


}

//LOGIN -->corretto
exports.login = async (req, res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: 'inserire tutti i dati'});
        }
        console.log(email + password);
        const findUser = await user.findOne({email: email}).select('+password')
        console.log(findUser)
        if(!findUser){
            return res.status(400).json({message: 'email errata'})
        }
        const rightPassword = await findUser.comparePassword(password);
        console.log(rightPassword)
        if( !rightPassword){
           return res.status(400).json({message: 'password errata'})
        }

        const {accessToken, refreshToken} = generateToken(findUser._id);
        console.log({accessToken, refreshToken}) //per il debug
        console.log(`[LOGIN] Salvataggio refresh token nel DB: ${refreshToken} per utente ${findUser._id}`); //log per il debug


        await RefreshToken.create({ token: refreshToken, userId: findUser._id }); //salvataggio del refresh token nel db per il controllo e l'eventuale creazione di access token

        //inviamo il refreshToken come cookie httpOnly, perchè inviarlo come cookie normale potrebbe renderlo vulnerabile agli attacchi

        res.cookie('jwt', refreshToken, {    // creiamo un cookie inserendo nome del cookie, valore inserito e delle opzioni tra cui
            httpOnly: true,                 //httpOnly (per renderlo non disponibile a javascript e quindi più sicuro),
            sameSite: 'Strict',            //sameSite che a prevenire CSRF e maxAge per quando scade(in ms)
            maxAge: 7*24*60*60*1000
        });

        console.log('sto per inviare la risposta')
        res.status(200).json({
            message: 'login eseguito correttamente',
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


    }catch(err){
        return res.status(500).send({message: 'errore nel server, riprovare'})
    }
}

//LOGOUT-->corretto
exports.logout = async (req, res)=>{
    //nel frontend va eliminato l'accesso token
    const cookies = req.cookies
    const refreshTokenCookie = cookies.jwt
    if(!cookies?.jwt) return res.status(404).json({message: 'refresh token non trovato'})
    try{
        //rimuoviamo il refresh token dal db
        await RefreshToken.deleteOne({token: refreshTokenCookie})

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

// GETME: metodo che serve per l'area personale per fare comparire i propri dati-->corretta ma va ricontrollata quando faccio i tournaments
exports.getMe = async function(req, res, next){
    try{
        const id = req.userId;
        console.log(id)
        const me = await user.findById(id).populate('tournamentsOrganized').populate('teams');
        if(!me){
            res.status(404).json({message: 'dati non trovati'})
        }
        const hasNoTournaments = me.teams.every(team => team.tournaments.length === 0);

        const hasNoTournamentsOrganized = me.tournamentsOrganized.length === 0

        const messageTournaments = hasNoTournaments ? 'Non hai ancora partecipato a nessun torneo' : me.teams

        const messageOrganizer = hasNoTournamentsOrganized ? 'Non hai ancora organizzato nessun torneo!' : me.tournamentsOrganized

        res.status(200).json(
            {status: 'success',
                data: {
                username : me.username,
                email: me.email,
                teams: messageTournaments,
                tournaments: messageOrganizer

                }
            }
        )
        next()
    }catch(err){
        res.status(400).send({message: 'errore nella ricerca, riprovare'})
    }

    //si potrebbe aggiungere un campo per modificare alcuni dati dell'utente come la password, ma per la modifica della password bisogna ancora capire bene
}


