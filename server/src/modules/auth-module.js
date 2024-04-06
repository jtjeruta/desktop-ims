const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'TEST_SECRET'

module.exports.generateAccessToken = (user) => {
    return jwt.sign({ id: user._id.toString() }, JWT_SECRET, {
        expiresIn: '2 days',
    })
}

module.exports.verifyToken = (token) => {
    try {
        const data = jwt.verify(token, JWT_SECRET)
        return [true, data]
    } catch (error) {
        console.error('Failed to verify token: ', error)
        return [false]
    }
}
