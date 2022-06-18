const bcrypt = require('bcrypt')
const AuthModule = require('../modules/auth-module')
const UsersModule = require('../modules/users-module')

module.exports.login = async (req, res) => {
    const { email, password } = req.body

    const getUserResponse = await UsersModule.getUserByEmail(email)

    if (getUserResponse[0] !== 200) {
        return res.status(getUserResponse[0]).json(getUserResponse[1])
    }

    if (!getUserResponse[1]) {
        return res.status(404).json({ message: 'Wrong username or password.' })
    }

    const validatePassword = await bcrypt.compare(
        password,
        getUserResponse[1].password
    )

    if (!validatePassword) {
        return res.status(404).json({ message: 'Wrong username or password.' })
    }

    const token = AuthModule.generateAccessToken(getUserResponse[1])
    return res.status(200).json({ token })
}

module.exports.verifyToken = async (req, res) => {
    const token = req.headers.authorization || ''
    const response = AuthModule.verifyToken(token)

    if (response[0]) {
        return res.status(200).json(response[1])
    } else {
        return res.status(500).json({ message: 'Something went wrong.' })
    }
}
