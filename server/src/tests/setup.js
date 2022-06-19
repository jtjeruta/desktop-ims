const mongoose = require('mongoose')

const setup = () => {
    // eslint-disable-next-line
    beforeEach((done) => {
        mongoose.connection.db.dropDatabase(function (err) {
            if (err) {
                console.error('Failed to drop database')
                done(err)
            }

            done()
        })
    })
}

module.exports = setup
