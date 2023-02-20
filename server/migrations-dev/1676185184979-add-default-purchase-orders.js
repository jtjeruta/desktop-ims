const { faker } = require('@faker-js/faker')
const moment = require('moment')
const { dbConnect } = require('../src/lib/db')
const PurchaseOrdersModule = require('../src/modules/purchase-orders-module')
const ProductsModule = require('../src/modules/products-module')
const VendorsModule = require('../src/modules/vendors-module')
const WarehousesModule = require('../src/modules/warehouses-module')
const { getRandomSubset, getRandomElement } = require('../src/utils/array')
require('../src/schemas/variant-schema')
require('../src/schemas/product-schema')
require('../src/schemas/vendor-schema')
require('../src/schemas/warehouse-schema')

dbConnect()

async function up() {
    const [products, vendors, warehouses] = await Promise.all([
        ProductsModule.listProducts(),
        VendorsModule.listVendors(),
        WarehousesModule.listWarehouses(),
    ])

    const purchaseOrders = Array.from({ length: 100 }, () => {
        const orderProducts = getRandomSubset(
            products[1],
            faker.datatype.number({ min: 1, max: 5 })
        ).map((product) => {
            const qty = faker.datatype.number({ min: 1, max: 20 })
            const itemPrice = faker.datatype.number({ min: 10, max: 200 })
            const variant = getRandomElement(product.variants)

            return {
                id: faker.datatype.uuid(),
                product: product._id,
                quantity: qty,
                itemPrice,
                totalPrice: qty * itemPrice * variant.quantity,
                variant: {
                    name: variant.name,
                    quantity: variant.quantity,
                },
                warehouse: getRandomElement(warehouses[1])._id,
            }
        })

        const total = orderProducts.reduce(
            (acc, cur) => acc + cur.totalPrice,
            0
        )

        return {
            products: orderProducts,
            vendor: getRandomElement(vendors[1])._id,
            total,
            remarks: faker.lorem.sentence(),
            orderDate: moment(faker.date.past()).unix(),
            invoiceNumber: faker.datatype.number(100000),
        }
    })

    const responses = await Promise.all(
        purchaseOrders.map((purchaseOrder) =>
            PurchaseOrdersModule.createPurchaseOrder(purchaseOrder)
        )
    )

    if (responses.some((res) => res[0] !== 201)) {
        throw 'Failed to create purchase orders'
    }
}

async function down() {
    await PurchaseOrdersModule.deletePurchaseOrders()
}

module.exports = { up, down }
