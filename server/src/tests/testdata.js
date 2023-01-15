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
    company: 'company 1',
    category: 'category 1',
    subCategory: 'sub-category 1',
    price: 15,
    published: true,
    modifiedBy: mongoose.Types.ObjectId(),
    sku: generateSKU(),
    stock: 0,
}

module.exports.product2 = {
    name: 'Product 2',
    company: 'company 2',
    category: 'category 2',
    subCategory: 'sub-category 2',
    price: 24,
    published: false,
    modifiedBy: mongoose.Types.ObjectId(),
    sku: generateSKU(),
    stock: 10,
}

module.exports.product3 = {
    name: 'Product 3',
    company: 'company 3',
    category: 'category 3',
    subCategory: 'sub-category 3',
    price: 70,
    published: false,
    modifiedBy: mongoose.Types.ObjectId(),
    sku: generateSKU(),
    stock: 100,
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
}

module.exports.warehouse2 = {
    name: 'Warehouse 2',
}

module.exports.vendor1 = {
    name: 'Vendor 1',
    phone: '+639052345665',
    address: '8785 Sunset Court San Jose, CA 95127',
    email: 'vendor1@test.com',
    remarks: 'This is a test.',
}

module.exports.vendor2 = {
    name: 'Vendor 2',
    phone: '+639056745665',
    address: '09123 Sunrise Court San Bennedict, SA 09231',
    email: 'vendor2@test.com',
    remarks: 'This is a test.',
}

module.exports.customer1 = {
    name: 'Customer 1',
    phone: '',
    address: '',
    email: '',
}

module.exports.customer2 = {
    name: 'Customer 2',
    phone: '+639053215665',
    address: 'Lot 2 Blk 12, San Francisco Village, Lapuz, Iloilo City',
    email: 'customer2@mail.com',
}
