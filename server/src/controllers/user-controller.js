const { ObjectId } = require('mongoose').Types
const UsersModule = require('../modules/users-module')
const { UsersView, UserView } = require('../views/user-view')

module.exports.createUser = async (req, res) => {
    const rawUser = req.body

    const query = {
        $or: [{ email: rawUser.email }, { username: rawUser.username }],
    }

    const validateResponse = await UsersModule.getUser(query)
    if (validateResponse[0] === 200) {
        const errors = {}

        if (validateResponse[1].email === rawUser.email) {
            errors.email = { message: 'Email already exists.' }
        }

        if (validateResponse[1].username === rawUser.username) {
            errors.username = { message: 'Username already exists.' }
        }

        return res.status(400).json({ errors })
    }

    const [status, data] = await UsersModule.createUser(rawUser)

    if (status !== 201) return res.status(status).json(data)

    return res.status(201).json({ user: UserView(data) })
}

module.exports.listUsers = async (req, res) => {
    const [status, data] = await UsersModule.listUsers({
        archived: { $ne: true },
    })

    if (status !== 200) return res.status(status).json(data)

    const users = UsersView(data)
    return res.status(200).json({ users })
}

module.exports.updateUser = async (req, res) => {
    const { userId } = req.params
    const updateDoc = req.body

    const query = {
        _id: { $ne: ObjectId(userId) },
        $or: [{ email: updateDoc.email }, { username: updateDoc.username }],
    }

    const validateResponse = await UsersModule.getUser(query)
    if (validateResponse[0] === 200) {
        if (validateResponse[0] === 200) {
            const errors = {}

            if (validateResponse[1].email === updateDoc.email) {
                errors.email = { message: 'Email already exists.' }
            }

            if (validateResponse[1].username === updateDoc.username) {
                errors.username = { message: 'Username already exists.' }
            }

            return res.status(400).json({ errors, message: 'Duplicate found.' })
        }
    }

    const [status, data] = await UsersModule.updateUser(userId, updateDoc)

    if (status !== 200) return res.status(status).json(data)
    return res.status(200).json({ user: UserView(data) })
}

module.exports.archiveUser = async (req, res) => {
    const { userId } = req.params

    if (req.con._id.equals(userId)) {
        return res.status(405).json({ message: 'Not allowed.' })
    }

    const [status, data] = await UsersModule.updateUser(userId, {
        archived: true,
    })

    if (status !== 200) return res.status(status).json(data)
    return res.status(200).json({ message: 'User deleted.' })
}
