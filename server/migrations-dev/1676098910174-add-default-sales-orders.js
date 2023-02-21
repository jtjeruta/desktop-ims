const { faker } = require('@faker-js/faker')
const moment = require('moment')
const { dbConnect } = require('../src/lib/db')
const SalesOrdersModule = require('../src/modules/sales-orders-module')
const ProductsModule = require('../src/modules/products-module')
const CustomersModule = require('../src/modules/customers-module')
const WarehousesModule = require('../src/modules/warehouses-module')
const { getRandomSubset, getRandomElement } = require('../src/utils/array')
require('../src/schemas/variant-schema')
require('../src/schemas/product-schema')
require('../src/schemas/customer-schema')
require('../src/schemas/warehouse-schema')

dbConnect()

async function up() {
    const [products, customers, warehouses] = await Promise.all([
        ProductsModule.listProducts(),
        CustomersModule.listCustomers(),
        WarehousesModule.listWarehouses(),
    ])

    const salesOrders = Array.from({ length: 10 }, () => {
        const orderProducts = getRandomSubset(
            products[1],
            faker.datatype.number({ min: 1, max: 5 })
        ).map((product) => {
            const qty = faker.datatype.number({ min: 1, max: 20 })
            const itemPrice = product.sellingPrice
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
            customer: getRandomElement(customers[1])._id,
            total,
            remarks: faker.lorem.sentence(),
            orderDate: moment(faker.date.past()).unix(),
            invoiceNumber: faker.datatype.number(100000),
        }
    })

    const responses = await Promise.all(
        salesOrders.map((salesOrder) =>
            SalesOrdersModule.createSalesOrder(salesOrder)
        )
    )

    if (responses.some((res) => res[0] !== 201)) {
        throw 'Failed to create sales orders'
    }
}

async function down() {
    await SalesOrdersModule.deleteSalesOrders()
}

module.exports = { up, down }
