const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {

    console.log('middleware start')

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {// controllo che gli accessToken comincino con 'Bearer'
        console.log('auth failed 1')
        return res.status(401).json({message: 'errore di autorizzazione, rifare il login'});
    }
    console.log('dal middleware '+authHeader); //serve per il debug si può togliere
    const token = authHeader.split(' ')[1];// il token è nella prima posizione dopo lo spazio ( nella posizione 0 c'è scritto Bearer)

    try{
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.userId = decoded.userId//decoded contiene l'informazione decodificata
        console.log('middleware ok')
        console.log('verifica avvenuta con successo');
        next()
    } catch(err){
        console.log(err);
        console.log('middleware error')
        return res.status(401).json({message: 'token non valido'});

    }
    console.log('middleware end')
}

module.exports = verifyJWT;