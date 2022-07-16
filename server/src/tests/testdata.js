const { default: mongoose } = require('mongoose')
const { generateSKU } = require('../modules/products-module')

module.exports.admin1 = {
    email: 'dutch@vanderlinde.com',
    firstName: 'Dutch',
    lastName: 'Vanderlinde',
    role: 'admin',
    password: 'i-have-a-plan',
}

module.exports.employee1 = {
    email: 'arthur@vanderlinde.com',
    firstName: 'Arthur',
    lastName: 'Morgan',
    role: 'employee',
    password: 'can-i-turn-myself-in?',
}

module.exports.employee2 = {
    email: 'john@vanderlinde.com',
    firstName: 'John',
    lastName: 'Marshton',
    role: 'employee',
    password: 'doubts-and-scars',
}

module.exports.product1 = {
    name: 'Product 1',
    brand: 'brand 1',
    category: 'category 1',
    subCategory: 'sub-category 1',
    price: 15,
    aveUnitCost: 10,
    published: true,
    modifiedBy: mongoose.Types.ObjectId(),
    sku: generateSKU(),
    storeQty: 0,
}

module.exports.product2 = {
    name: 'Product 2',
    brand: 'brand 2',
    category: 'category 2',
    subCategory: 'sub-category 2',
    price: 24,
    aveUnitCost: 20,
    published: false,
    modifiedBy: mongoose.Types.ObjectId(),
    sku: generateSKU(),
    storeQty: 10,
}

module.exports.product3 = {
    name: 'Product 3',
    brand: 'brand 3',
    category: 'category 3',
    subCategory: 'sub-category 3',
    price: 70,
    aveUnitCost: 15,
    published: false,
    modifiedBy: mongoose.Types.ObjectId(),
    sku: generateSKU(),
    storeQty: 100,
}

module.exports.variant1 = {
    name: 'Variant 1',
    quantity: 10,
}

module.exports.variant2 = {
    name: 'Variant 2',
    quantity: 20,
}

module.exports.warehouse1 = {
    name: 'Warehouse 1',
    quantity: 10,
}

module.exports.warehouse2 = {
    name: 'Warehouse 2',
    quantity: 20,
}
