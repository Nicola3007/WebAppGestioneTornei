const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const user = require('../models/userModel.js');
const refreshToken = require('../models/refreshTokenModel.js');
require('dotenv').config();

//va capito se va bene fare un altro controller, l'ho fatto per maggiore pulizia.
//si potrebbe implementare che se il refreshToken è in un cookie e non nel database si rieffetua il logni per meggiore sicurezza

//questo controller serve per gestire il refresh token e quindi principalmente per generare acces token quando invocato


//funziona
exports.handleRefreshToken = async (req, res) =>{
    const cookies = req.cookies;
    if (!cookies?.jwt) { //controllo se ho cookie e nel caso se sono jwt
        return res.status(401).json({message: 'refresh token mancante, non autorizzato'});
    }
    console.log(cookies.jwt); //per il debug
    const refreshTokenCookie = cookies.jwt
    console.log(refreshTokenCookie);
    try {
        //trovo l'utente nel db
        const foundUser = await refreshToken.findOne({token: refreshTokenCookie});
        if (!foundUser) {
           return  res.status(403).json({message: 'non autorizzato'})
        }
//valutazione del refresh token
        jwt.verify(
            refreshTokenCookie,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                console.log(decoded.userId);
                console.log(err);
                console.log(foundUser.userId.toString());
                if (err || foundUser.userId.toString() !== decoded.userId) {
                    return res.status(403).json({message: 'non autorizzato, refresh token non valido'})
                }

                //se il refresh token è valido genero un nuovo access token
                const accessToken = jwt.sign(
                    {'_id': decoded._id},
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn: '15m'} //va modificato a 15 minuti
                )
                res.json({accessToken: accessToken})
            }
        )
    }catch(err){
        console.log(err); //per il debug
        res.status(500).json({message: 'errore nel server'})
    }
}

