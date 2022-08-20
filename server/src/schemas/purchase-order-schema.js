const mongoose = require('mongoose')
const defaultSchema = require('./default-schema')

const PurchaseOrderSchema = new mongoose.Schema({
    ...defaultSchema,
    products: {
        required: true,
        validate: [
            (val) => val.length > 0,
            'Path `products` must contain atleast 1.',
        ],
        type: [
            {
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
            },
        ],
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
    },
    total: {
        type: Number,
        required: true,
        min: [0, 'Path `quantity` can not be less than 0.'],
    },
})

const PurchaseOrderModel = mongoose.model('PurchaseOrder', PurchaseOrderSchema)

module.exports = { PurchaseOrderModel, PurchaseOrderSchema }
