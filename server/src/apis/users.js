const express = require('express')
const router = express.Router()
const UserModel = require('../models/user-model')

router.post('/api/v1/users', async (req, res, next) => {
    const user = new UserModel(req.body)

    try {
        await user.save()
        return res.status(201).json({ createdUser: user })
    } catch (error) {
        console.error('Failed to create user')
        return next(error)
    }
})

module.exports = router
