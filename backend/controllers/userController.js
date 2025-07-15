const user = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/refreshTokenModel.js');
require('dotenv').config();

//funzione helper per la generazione di token
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

//REGISTRAZIONE
exports.createUser= async (req, res)=>{
    try{
        const {username, email, password} = req.body;
        const existingUser = await user.findOne({email})

        if(existingUser){
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

//LOGIN
exports.login = async (req, res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: 'inserire tutti i dati'});
        }

        const findUser = await user.findOne({email: email}).select('+password')

        if(!findUser){
            return res.status(400).json({message: 'email errata'})
        }
        const rightPassword = await findUser.comparePassword(password);

        if( !rightPassword){
           return res.status(400).json({message: 'password errata'})
        }

        const {accessToken, refreshToken} = generateToken(findUser._id);

        console.log(accessToken)

        await RefreshToken.create({ token: refreshToken, userId: findUser._id }); //salvataggio del refresh token nel db per il controllo e l'eventuale creazione di access token

        //inviamo il refreshToken come cookie httpOnly, perchè inviarlo come cookie normale potrebbe renderlo vulnerabile agli attacchi

        res.cookie('jwt', refreshToken, {    // creiamo un cookie inserendo nome del cookie, valore inserito e delle opzioni tra cui
            httpOnly: true,                 //httpOnly (per renderlo non disponibile a javascript e quindi più sicuro),
            sameSite: 'lax',                //sameSite che serv a prevenire CSRF e maxAge per quando scade(in ms)--> è inserito lax perchè frontend e beckend girano su porte diverse e il cookie in questo caso con samSite Strict non viene inviato
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
        return res.status(500).json({message: 'errore nel server, riprovare'})
    }
}

//LOGOUT-->corretto
exports.logout = async (req, res)=>{

    console.log('comincia il logout');
    const cookies = req.cookies
    const refreshTokenCookie = cookies.jwt
    console.log(refreshTokenCookie)
    if(!cookies?.jwt) return res.status(404).json({message: 'refresh token non trovato'})

    try{
        //rimuoviamo il refresh token dal db
        await RefreshToken.deleteOne({token: refreshTokenCookie})

        //puliamo il cookie

        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'lax'
        })

        res.status(200).json({message: 'logout effettuato con successo'})


    }catch{
        res.status(500).json({message: 'errore nel server'})
    }
}
