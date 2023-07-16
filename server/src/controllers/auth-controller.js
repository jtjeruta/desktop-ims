const bcrypt = require('bcrypt')
const AuthModule = require('../modules/auth-module')
const UsersModule = require('../modules/users-module')
const { UserView } = require('../views/user-view')

module.exports.login = async (req, res) => {
    const { email, password } = req.body

    const getUserResponse = await UsersModule.getUser({
        $or: [{ email }, { username: email }],
    })

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
    const tokenResponse = AuthModule.verifyToken(token)

    if (!tokenResponse[0]) {
        return res.status(401).json({ message: 'Unauthorized.' })
    }

    const userResponse = await UsersModule.getUserById(tokenResponse[1].id)

    if (!userResponse[0]) {
        return res.status(401).json({ message: 'Unauthorized.' })
    }

    req.con = userResponse[1]
    return next()
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

module.exports.setup = async (req, res) => {
    const userRes = await UsersModule.getUser({})
    if (userRes[0] !== 404)
        return res.status(400).json({ message: 'User already exists.' })

    const [status, data] = await UsersModule.createUser({
        ...req.body,
        role: 'admin',
    })
    if (status !== 201) return res.status(status).json(data)

    const token = AuthModule.generateAccessToken(data)
    return res.status(201).json({ user: UserView(data), token })
}

module.exports.needsSetup = async (req, res, next) => {
    const userRes = await UsersModule.getUser({})
    if (![404, 200].includes(userRes[0]))
        return res.status(userRes[0]).json(userRes[1])
    return res.status(200).json({ needsSetup: userRes[0] === 404 })
}

module.exports.forgotPassword = async (req, res) => {
    // hacky way of handling forgotten password since app is offline only
    const { email, code } = req.body
    const currentCode = 'b4d72cb6-b13a-4f19-8b26-b9abe3b7aee0'

    if (code !== currentCode) {
        return res.status(400).json({ message: 'Invalid code.' })
    }

    const getUserResponse = await UsersModule.getUser({
        $or: [{ email }, { username: email }],
    })

    if (getUserResponse[0] !== 200) {
        return res.status(getUserResponse[0]).json(getUserResponse[1])
    }

    const token = AuthModule.generateAccessToken(getUserResponse[1])
    return res.status(200).json({ token, user: UserView(getUserResponse[1]) })
}
