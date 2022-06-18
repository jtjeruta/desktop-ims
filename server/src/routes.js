const express = require('express')
const AuthController = require('./controllers/auth-controller')
const UserController = require('./controllers/user-controller')

const router = express.Router()

router.post('/api/v1/auth/login', AuthController.login)

router.post('/api/v1/users', UserController.createUser)
router.get('/api/v1/users', UserController.listUsers)

module.exports = router
