const express = require('express')
const AuthController = require('./controllers/auth-controller')
const UserController = require('./controllers/user-controller')
const ProductController = require('./controllers/product-controller')

const { isAdmin, isAuthenticated } = AuthController

const router = express.Router()

// auth
router.post('/api/v1/auth/login', AuthController.login)
router.post('/api/v1/auth/verify-token', AuthController.verifyToken)

// users
router.post('/api/v1/users', isAdmin, UserController.createUser)
router.get('/api/v1/users', isAdmin, UserController.listUsers)
router.put('/api/v1/users/:userId', isAdmin, UserController.updateUser)
router.delete('/api/v1/users/:userId', isAdmin, UserController.deleteUser)

// products
router.get('/api/v1/products', isAuthenticated, ProductController.listProducts)
router.post('/api/v1/products', isAdmin, ProductController.createProduct)
router.put(
    '/api/v1/products/:productId',
    isAdmin,
    ProductController.updateProduct
)

module.exports = router
