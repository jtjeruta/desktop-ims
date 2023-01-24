const moment = require('moment')
const { getMongoError } = require('../lib/mongo-errors')
const { CustomerModel } = require('../schemas/customer-schema')

module.exports.createCustomer = async (data, session = null) => {
    const doc = {
        ...data,
        createdAt: moment().unix(),
        modifiedAt: moment().unix(),
    }

    const customer = new CustomerModel(doc)

    try {
        const createdCustomer = await (session
            ? customer.save({ session })
            : customer.save())
        return [201, createdCustomer]
    } catch (error) {
        console.error('Failed to create customer')
        return getMongoError(error)
    }
}

module.exports.listCustomers = async (query = {}, session = null) => {
    try {
        const customers = await CustomerModel.find(query).session(session)
        return [200, customers]
    } catch (error) {
        console.error('Failed to list customers')
        return getMongoError(error)
    }
}

module.exports.updateCustomer = async (id, data, session) => {
    const doc = {
        ...data,
        modifiedAt: moment().unix(),
    }

    try {
        const updatedCustomer = await CustomerModel.findByIdAndUpdate(
            { _id: id },
            { $set: doc },
            { new: true, runValidators: true, session }
        )
        return [200, updatedCustomer]
    } catch (error) {
        console.error('Failed to update customer')
        return getMongoError(error)
    }
}

module.exports.getCustomerById = async (id, session) => {
    try {
        const customer = await CustomerModel.findById(id).session(session)

        if (!customer) return [404, { message: 'Customer not found.' }]
        return [200, customer]
    } catch (error) {
        console.error('Failed to get customer by id')
        return getMongoError(error)
    }
}

module.exports.deleteCustomers = async (query = {}, session) => {
    try {
        await CustomerModel.deleteMany(query).session(session)
        return [200]
    } catch (error) {
        console.error('Failed to delete customers')
        return getMongoError(error)
    }
}
