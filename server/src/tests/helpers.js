const request = require('supertest')
const app = require('../app')

module.exports.login = (user = {}) => {
    return request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .then((res) => res.body.token)
}
