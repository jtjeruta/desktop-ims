const { UserModel } = require('../schemas/user-schema')
const { ProductModel } = require('../schemas/product-schema')

const models = [UserModel, ProductModel]

const setup = () => {
    // eslint-disable-next-line
    beforeEach(async () => {
        await Promise.all(
            models.map(async (model) => {
                await model.deleteMany({})
                await model.collection.dropIndexes()
                await model.createIndexes()
            })
        )
    })
}

module.exports = setup
