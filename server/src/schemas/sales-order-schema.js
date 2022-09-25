const mongoose = require('mongoose')
const defaultSchema = require('./default-schema')

const SalesOrderSchema = new mongoose.Schema({
    ...defaultSchema,
    products: {
        required: true,
        validate: [
            (val) => val.length > 0,
            'Path `products` must contain atleast 1.',
        ],
        type: [
            {
                id: {
                    type: String,
                    required: true,
                },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [0, 'Path `quantity` can not be less than 0.'],
                },
                itemPrice: {
                    type: Number,
                    required: true,
                    min: [0, 'Path `quantity` can not be less than 0.'],
                },
                totalPrice: {
                    type: Number,
                    required: true,
                    min: [0, 'Path `quantity` can not be less than 0.'],
                },
                warehouse: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Warehouse',
                },
            },
        ],
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    total: {
        type: Number,
        required: true,
        min: [0, 'Path `quantity` can not be less than 0.'],
    },
    remarks: {
        type: String,
    },
    orderDate: {
        type: Number,
    },
})

const SalesOrderModel = mongoose.model('SalesOrder', SalesOrderSchema)

module.exports = { SalesOrderModel, SalesOrderSchema }
