const jwt = require('jsonwebtoken');
const refreshToken = require('../models/refreshTokenModel.js');
require('dotenv').config();

//questo controller serve per gestire il refresh token e quindi principalmente per generare acces token quando invocato

exports.handleRefreshToken = async (req, res) =>{
    const cookies = req.cookies;
    if (!cookies?.jwt) { //controllo se ho cookie e nel caso se sono jwt
        return res.status(401).json({message: 'refresh token mancante, non autorizzato'});
    }

    const refreshTokenCookie = cookies.jwt

    try {
        //trovo l'utente nel db
        const foundUser = await refreshToken.findOne({token: refreshTokenCookie});
        if (!foundUser) {
           return  res.status(401).json({message: 'refresh token scaduto'})
        }
//valutazione del refresh token
        jwt.verify(
            refreshTokenCookie,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                console.log(decoded.userId);
                console.log(err);
                if (err || foundUser.userId.toString() !== decoded.userId) {
                    return res.status(403).json({message: 'non autorizzato, refresh token non valido'})
                }

                console.log('refresh token valido');

                //se il refresh token è valido genero un nuovo access token
                const accessToken = jwt.sign(
                    {'userId': decoded.userId},
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn: '15m'}
                )
                console.log(accessToken, 'il refresh è avvenuto correttamente');
                res.json({accessToken: accessToken})
            }
        )
    }catch(err){
        console.log(err); //per il debug
        res.status(500).json({message: 'errore nel server'})
    }
}

