const moment = require('moment')
const { uploadBackupToS3 } = require('./aws')
const { listCustomers } = require('../modules/customers-module')
const { listExpenses } = require('../modules/expenses-module')
const { listProducts } = require('../modules/products-module')
const { listPurchaseOrders } = require('../modules/purchase-orders-module')
const { listReceivables } = require('../modules/receivables-module')
const { listSalesOrders } = require('../modules/sales-orders-module')
const { listUsers } = require('../modules/users-module')
const { listVariants } = require('../modules/variants-module')
const { listVendors } = require('../modules/vendors-module')
const { listWarehouses } = require('../modules/warehouses-module')

const NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = async () => {
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

    const date = moment().format('YYYY-MM-DD-HH-mm-ss')
    const backupData = data.map(([, data]) => data)
    return uploadBackupToS3(`${NODE_ENV}/backup-${date}.json`, backupData)
}
