const express = require('express')
const UserController = require('./controllers/user-controller')

const router = express.Router()

router.post('/api/v1/users', UserController.createUser)
router.get('/api/v1/users', UserController.listUsers)
// router.get('/api/v1/users/:id', UserController.getUser)

module.exports = router
