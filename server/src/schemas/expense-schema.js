const mongoose = require('mongoose')
const defaultSchema = require('./default-schema')
const Schema = mongoose.Schema

const ExpenseSchema = new Schema({
    ...defaultSchema,
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Number,
        required: true,
    },
    description: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
})

const ExpenseModel = mongoose.model('Expense', ExpenseSchema)

module.exports = { ExpenseModel, ExpenseSchema }
