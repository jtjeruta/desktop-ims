const { UserModel } = require('../schemas/user-schema')

const setup = () => {
    // eslint-disable-next-line
    beforeEach(async () => {
        await UserModel.deleteMany({})
    })
}

module.exports = setup
