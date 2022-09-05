const { dbConnect } = require('../src/lib/db')
const { createUser, deleteUser } = require('../src/modules/users-module')

dbConnect()

module.exports.up = async () => {
    const reponses = await Promise.all([
        createUser({
            email: 'admin@gmail.com',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            password: 'password',
        }),
        createUser({
            email: 'employee@gmail.com',
            firstName: 'Employee',
            lastName: 'User',
            role: 'employee',
            password: 'password',
        }),
    ])

    if (reponses.some((res) => res[0] !== 201)) {
        throw 'Failed to create user'
    }
}

module.exports.down = async () => {
    const responses = await Promise.all([
        deleteUser({ email: 'admin@gmail.com' }),
        deleteUser({ email: 'employee@gmail.com' }),
    ])

    if (responses.some((res) => res[0] !== 200)) {
        throw 'Failed to create user'
    }
}
