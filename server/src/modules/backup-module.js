const moment = require('moment')
const { uploadJSONToS3, getObject, listBucketObjects } = require('../lib/s3')
const { listCustomers, createCustomer } = require('./customers-module')
const { listExpenses, createExpense } = require('./expenses-module')
const { listProducts, createProduct } = require('./products-module')
const {
    listPurchaseOrders,
    createPurchaseOrder,
} = require('./purchase-orders-module')
const { listReceivables, createReceivable } = require('./receivables-module')
const { listSalesOrders, createSalesOrder } = require('./sales-orders-module')
const { listUsers, createUser } = require('./users-module')
const { listVariants, createVariant } = require('./variants-module')
const { listVendors, createVendor } = require('./vendors-module')
const { listWarehouses, createWarehouse } = require('./warehouses-module')

const NODE_ENV = process.env.NODE_ENV || 'development'
const BUCKET = process.env.BACKUPS_BUCKET || 'ims-backups'

module.exports.backup = async () => {
    const data = await Promise.all([
        listCustomers(),
        listExpenses(),
        listProducts(),
        listPurchaseOrders(),
        listReceivables(),
        listSalesOrders(),
        listUsers(),
        listVariants(),
        listVendors(),
        listWarehouses(),
    ])

    const fetchError = data.find(([status]) => status !== 200)
    if (fetchError) return fetchError

    const date = moment().format('YYYY-MM-DD-HH:mm:ss')
    const backupData = data.map(([, data]) => data)
    return uploadJSONToS3(BUCKET, `${NODE_ENV}/backup-${date}.json`, backupData)
}

module.exports.restore = async (key) => {
    const backupRes = await getObject(BUCKET, key)
    if (backupRes[0] !== 200) return backupRes

    const responses = await Promise.all([
        ...backupRes[1][0].map((customer) => createCustomer(customer)),
        ...backupRes[1][1].map((expense) => createExpense(expense)),
        ...backupRes[1][2].map((product) => createProduct(product)),
        ...backupRes[1][3].map((purchaseOrder) =>
            createPurchaseOrder(purchaseOrder)
        ),
        ...backupRes[1][4].map((receivable) => createReceivable(receivable)),
        ...backupRes[1][5].map((salesOrder) => createSalesOrder(salesOrder)),
        ...backupRes[1][6].map((user) => createUser(user)),
        ...backupRes[1][7].map((variant) => createVariant(variant)),
        ...backupRes[1][8].map((vendor) => createVendor(vendor)),
        ...backupRes[1][9].map((warehouse) => createWarehouse(warehouse)),
    ])

    return [
        200,
        {
            succeeded: responses.filter(([status]) => status === 201).length,
            failed: responses.filter(([status]) => status !== 201).length,
        },
    ]
}

module.exports.listBackups = async () => {
    return listBucketObjects(BUCKET, NODE_ENV)
}
