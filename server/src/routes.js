const express = require('express')
const AuthController = require('./controllers/auth-controller')
const UserController = require('./controllers/user-controller')
const ProductController = require('./controllers/product-controller')
const VariantController = require('./controllers/variant-controller')
const WarehouseController = require('./controllers/warehouse-controller')
const VendorController = require('./controllers/vendor-controller')
const PurchaseOrderController = require('./controllers/purchase-order-controller')
const HealthCheckController = require('./controllers/health-check-controller')
const CustomerController = require('./controllers/customer-controller')
const SalesOrderController = require('./controllers/sales-order-controller')
const StatController = require('./controllers/stat-controller')
const ExpenseController = require('./controllers/expense-controller')
const ReceivableController = require('./controllers/receivable-controller')
const PingController = require('./controllers/ping-controller')
const BackupController = require('./controllers/backup-controller')

const { isAdmin, isAuthenticated } = AuthController

const router = express.Router()

// health check
router.get('/api/v1/health-check', HealthCheckController.healthCheck)

// backup
router.get('/api/v1/backup', BackupController.backup)

// auth
router.post('/api/v1/auth/login', AuthController.login)
router.post('/api/v1/auth/verify-token', AuthController.verifyToken)
router.post('/api/v1/auth/setup', AuthController.setup)
router.get('/api/v1/auth/needs-setup', AuthController.needsSetup)
router.post('/api/v1/auth/forgot-password', AuthController.forgotPassword)

// users
router.post('/api/v1/users', isAdmin, UserController.createUser)
router.get('/api/v1/users', isAdmin, UserController.listUsers)
router.put('/api/v1/users/:userId', isAdmin, UserController.updateUser)
router.delete('/api/v1/users/:userId', isAdmin, UserController.archiveUser)
router.put(
    '/api/v1/users/:userId/password',
    isAdmin,
    UserController.changePassword
)

// products
router.get('/api/v1/products/:productId', isAdmin, ProductController.getProduct)
router.get('/api/v1/products', isAuthenticated, ProductController.listProducts)
router.post('/api/v1/products', isAdmin, ProductController.createProduct)
router.put(
    '/api/v1/products/:productId',
    isAdmin,
    ProductController.updateProduct
)
router.put(
    '/api/v1/products/:productId/transfer-stock',
    isAdmin,
    ProductController.transferStock
)

// variants
router.post(
    '/api/v1/products/:productId/variants',
    isAdmin,
    VariantController.createVariant
)
router.delete(
    '/api/v1/variants/:variantId',
    isAdmin,
    VariantController.deleteVariant
)

// warehouses
router.get(
    '/api/v1/warehouses',
    isAuthenticated,
    WarehouseController.listWarehouses
)
router.get(
    '/api/v1/warehouses/:warehouseId',
    isAdmin,
    WarehouseController.getWarehouse
)
router.post('/api/v1/warehouses', isAdmin, WarehouseController.createWarehouse)
router.put(
    '/api/v1/warehouses/:warehouseId',
    isAdmin,
    WarehouseController.updateWarehouse
)
router.delete(
    '/api/v1/warehouses/:warehouseId',
    isAdmin,
    WarehouseController.deleteWarehouse
)

// vendors
router.get('/api/v1/vendors', isAdmin, VendorController.listVendors)
router.post('/api/v1/vendors', isAdmin, VendorController.createVendor)
router.put('/api/v1/vendors/:vendorId', isAdmin, VendorController.updateVendor)
router.delete(
    '/api/v1/vendors/:vendorId',
    isAdmin,
    VendorController.archiveVendor
)

// purchase orders
router.get(
    '/api/v1/purchase-orders',
    isAdmin,
    PurchaseOrderController.listPurchaseOrders
)
router.get(
    '/api/v1/purchase-orders/:purchaseOrderId',
    isAdmin,
    PurchaseOrderController.getPurchaseOrder
)
router.put(
    '/api/v1/purchase-orders/:purchaseOrderId',
    isAdmin,
    PurchaseOrderController.updatePurchaseOrder
)
router.post(
    '/api/v1/purchase-orders',
    isAdmin,
    PurchaseOrderController.createPurchaseOrder
)
router.delete(
    '/api/v1/purchase-orders/:orderId',
    isAdmin,
    PurchaseOrderController.deletePurchaseOrder
)

// customers
router.get(
    '/api/v1/customers',
    isAuthenticated,
    CustomerController.listCustomers
)
router.post(
    '/api/v1/customers',
    isAuthenticated,
    CustomerController.createCustomer
)
router.put(
    '/api/v1/customers/:customerId',
    isAuthenticated,
    CustomerController.updateCustomer
)

// sales orders
router.get(
    '/api/v1/sales-orders',
    isAuthenticated,
    SalesOrderController.listSalesOrders
)
router.get(
    '/api/v1/sales-orders/:salesOrderId',
    isAuthenticated,
    SalesOrderController.getSalesOrder
)
router.put(
    '/api/v1/sales-orders/:salesOrderId',
    isAuthenticated,
    SalesOrderController.updateSalesOrder
)
router.post(
    '/api/v1/sales-orders',
    isAuthenticated,
    SalesOrderController.createSalesOrder
)
router.delete(
    '/api/v1/sales-orders/:orderId',
    isAuthenticated,
    SalesOrderController.deleteSalesOrder
)

// stats
router.get(
    '/api/v1/stats/total-product-sales',
    isAdmin,
    StatController.getTotalProductSales
)
router.get(
    '/api/v1/stats/total-product-purchases',
    isAdmin,
    StatController.getTotalProductPurchases
)
router.get(
    '/api/v1/stats/sales-reports',
    isAdmin,
    StatController.listProductSalesReports
)
router.get(
    '/api/v1/stats/purchase-reports',
    isAdmin,
    StatController.listProductPurchaseReports
)
router.get(
    '/api/v1/stats/total-expenses',
    isAdmin,
    StatController.getTotalExpenses
)
router.get(
    '/api/v1/stats/total-receivables',
    isAdmin,
    StatController.getTotalReceivables
)

// expenses
router.get('/api/v1/expenses', isAdmin, ExpenseController.listExpenses)
router.post('/api/v1/expenses', isAdmin, ExpenseController.createExpense)
router.put(
    '/api/v1/expenses/:expenseId',
    isAdmin,
    ExpenseController.updateExpense
)
router.delete(
    '/api/v1/expenses/:expenseId',
    isAdmin,
    ExpenseController.deleteExpense
)

// receivables
router.get('/api/v1/receivables', isAdmin, ReceivableController.listReceivables)
router.post(
    '/api/v1/receivables',
    isAdmin,
    ReceivableController.createReceivable
)
router.put(
    '/api/v1/receivables/:receivableId',
    isAdmin,
    ReceivableController.updateReceivable
)
router.delete(
    '/api/v1/receivables/:receivableId',
    isAdmin,
    ReceivableController.deleteReceivable
)

// ping
router.get('/api/v1/ping', PingController.ping)

module.exports = router
