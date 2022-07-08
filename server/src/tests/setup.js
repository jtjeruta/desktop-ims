const { UserModel } = require('../schemas/user-schema')
const { ProductModel } = require('../schemas/product-schema')
const { VariantModel } = require('../schemas/variant-schema')

const models = [UserModel, ProductModel, VariantModel]

const setup = () => {
    // eslint-disable-next-line
    beforeEach(async () => {
        await Promise.all(
            models.map(async (model) => {
                await model.deleteMany({})
            })
        )
    })
}

module.exports = setup
