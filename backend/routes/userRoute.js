const express = require('express');
const route = express.Router();
const userController = require('../controllers/userController')
const refreshTokenController = require('../controllers/refreshTokenController')


route.post('/registazione',userController.createUser)
route.post('/login', userController.login);
route.post('/logout', userController.logout);
route.get('/personalArea', userController.getMe)

route.post('/refresh', refreshTokenController.handleRefreshToken)

module.exports = route;