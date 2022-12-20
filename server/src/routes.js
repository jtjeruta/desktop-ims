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

const { isAdmin, isAuthenticated } = AuthController

const router = express.Router()

// health check
router.get('/api/v1/health-check', HealthCheckController.healthCheck)

// auth
router.post('/api/v1/auth/login', AuthController.login)
router.post('/api/v1/auth/verify-token', AuthController.verifyToken)

// users
router.post('/api/v1/users', isAdmin, UserController.createUser)
router.get('/api/v1/users', isAdmin, UserController.listUsers)
router.put('/api/v1/users/:userId', isAdmin, UserController.updateUser)
router.delete('/api/v1/users/:userId', isAdmin, UserController.archiveUser)

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
router.get('/api/v1/warehouses', isAdmin, WarehouseController.listWarehouses)
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

// customers
router.get('/api/v1/customers', isAdmin, CustomerController.listCustomers)
router.post('/api/v1/customers', isAdmin, CustomerController.createCustomer)
router.put(
    '/api/v1/customers/:customerId',
    isAdmin,
    CustomerController.updateCustomer
)

// sales orders
router.get(
    '/api/v1/sales-orders',
    isAdmin,
    SalesOrderController.listSalesOrders
)
router.get(
    '/api/v1/sales-orders/:salesOrderId',
    isAdmin,
    SalesOrderController.getSalesOrder
)
router.put(
    '/api/v1/sales-orders/:salesOrderId',
    isAdmin,
    SalesOrderController.updateSalesOrder
)
router.post(
    '/api/v1/sales-orders',
    isAdmin,
    SalesOrderController.createSalesOrder
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
    '/api/v1/stats/product-reports',
    isAdmin,
    StatController.listProductReports
)
module.exports = router
