const bcrypt = require('bcrypt')
const AuthModule = require('../modules/auth-module')
const UsersModule = require('../modules/users-module')
const { UserView } = require('../views/user-view')

module.exports.login = async (req, res) => {
    const { email, password } = req.body

    const getUserResponse = await UsersModule.getUserByEmail(email)

    if (getUserResponse[0] !== 200) {
        return res.status(getUserResponse[0]).json(getUserResponse[1])
    }

    if (!getUserResponse[1]) {
        return res.status(400).json({ message: 'Wrong username or password.' })
    }

    const validatePassword = await bcrypt.compare(
        password,
        getUserResponse[1].password
    )

    if (!validatePassword) {
        return res.status(400).json({ message: 'Wrong username or password.' })
    }

    const token = AuthModule.generateAccessToken(getUserResponse[1])
    return res.status(200).json({ token, user: UserView(getUserResponse[1]) })
}

module.exports.verifyToken = async (req, res) => {
    const { token } = req.body

    const verifyTokenResponse = AuthModule.verifyToken(token)

    if (!verifyTokenResponse[0]) {
        return res.status(403).json({ message: 'Token failed to be verified.' })
    }

    const getUserResponse = await UsersModule.getUserById(
        verifyTokenResponse[1].id
    )

    if (getUserResponse[0] !== 200) {
        return res.status(getUserResponse[0]).json(getUserResponse[1])
    }

    return res.status(200).json({ user: UserView(getUserResponse[1]) })
}

module.exports.isAuthenticated = async (req, res, next) => {
    const token = req.headers.authorization || ''
    const response = AuthModule.verifyToken(token)

    if (response[0]) {
        return next()
    } else {
        return res.status(401).json({ message: 'Unauthorized.' })
    }
}

module.exports.isAdmin = async (req, res, next) => {
    const token = req.headers.authorization || ''
    const tokenResponse = AuthModule.verifyToken(token)

    if (!tokenResponse[0]) {
        return res.status(401).json({ message: 'Unauthorized.' })
    }

    const userResponse = await UsersModule.getUserById(tokenResponse[1].id)

    if (!userResponse[0] || userResponse[1].role !== 'admin') {
        return res.status(401).json({ message: 'Unauthorized.' })
    }

    req.con = userResponse[1]
    return next()
}
