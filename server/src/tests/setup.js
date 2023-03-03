const { UserModel } = require('../schemas/user-schema')
const { ProductModel } = require('../schemas/product-schema')
const { VariantModel } = require('../schemas/variant-schema')
const { WarehouseModel } = require('../schemas/warehouse-schema')
const { VendorModel } = require('../schemas/vendor-schema')
const { PurchaseOrderModel } = require('../schemas/purchase-order-schema')
const { CustomerModel } = require('../schemas/customer-schema')
const { SalesOrderModel } = require('../schemas/sales-order-schema')
const { ExpenseModel } = require('../schemas/expense-schema')
const { ReceivableModel } = require('../schemas/receivable-schema')

const models = [
    CustomerModel,
    ExpenseModel,
    ProductModel,
    PurchaseOrderModel,
    ReceivableModel,
    SalesOrderModel,
    UserModel,
    VariantModel,
    VendorModel,
    WarehouseModel,
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
