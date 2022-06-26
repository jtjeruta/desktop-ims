const UsersModule = require('../modules/users-module')
const { UsersView, UserView } = require('../views/user-view')

module.exports.createUser = async (req, res) => {
    const rawUser = req.body
    const [status, data] = await UsersModule.createUser(rawUser)

    if (status !== 201) return res.status(status).json(data)

    return res.status(201).json({ user: UserView(data) })
}

module.exports.listUsers = async (req, res) => {
    const [status, data] = await UsersModule.listUsers()

    if (status !== 200) return res.status(status).json(data)

    const users = UsersView(data)
    return res.status(200).json({ users })
}
