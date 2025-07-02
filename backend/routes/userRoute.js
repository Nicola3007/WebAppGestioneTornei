const express = require('express');
const route = express.Router();
const userController = require('../controllers/userController')
const refreshTokenController = require('../controllers/refreshTokenController')
const verifyToken = require('../middlewares/verifyJWT')

route.post('/registrazione',userController.createUser)
route.post('/login', userController.login);
route.post('/logout', verifyToken, userController.logout);
route.get('/personalArea',verifyToken, userController.getMe)

route.post('/refresh', refreshTokenController.handleRefreshToken)

module.exports = route;