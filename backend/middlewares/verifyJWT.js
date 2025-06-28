const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) { // controllo che gli accessToken comincino con 'Bearer'
        res.status(401).send({message: 'errore di autorizzazione'});
    }
    console.log(authHeader); //serve per il debug si può togliere
    const token = authHeader.split(' ')[1]; // il token è nella prima posizione dopo lo spazio ( nella posizione 0 c'è scritto Bearer)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({message: 'token non valido'});
        }
        req._id = decoded._id //decoded contiene l'informazione decodificata
        next()
    })

}

module.exports = verifyJWT;