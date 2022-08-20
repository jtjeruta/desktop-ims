const { UserModel } = require('../schemas/user-schema')
const { ProductModel } = require('../schemas/product-schema')
const { VariantModel } = require('../schemas/variant-schema')
const { WarehouseModel } = require('../schemas/warehouse-schema')
const { VendorModel } = require('../schemas/vendor-schema')
const { PurchaseOrderModel } = require('../schemas/purchase-order-schema')

const models = [
    UserModel,
    ProductModel,
    VariantModel,
    WarehouseModel,
    VendorModel,
    PurchaseOrderModel,
]

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
