const CustomersModule = require('../modules/customers-module')
const { CustomersView, CustomerView } = require('../views/customer-view')

module.exports.listCustomers = async (req, res) => {
    const customersRes = await CustomersModule.listCustomers()

    if (customersRes[0] !== 200) {
        return res.status(customersRes[0]).json(customersRes[1])
    }

    return res.status(200).json({ customers: CustomersView(customersRes[1]) })
}

module.exports.createCustomer = async (req, res) => {
    const response = await CustomersModule.createCustomer(req.body)

    if (response[0] !== 201) {
        return res.status(response[0]).json(response[1])
    }

    return res.status(201).json({ customer: CustomerView(response[1]) })
}

module.exports.updateCustomer = async (req, res) => {
    const { customerId } = req.params
    const response = await CustomersModule.updateCustomer(customerId, req.body)

    if (response[0] !== 200) {
        return res.status(response[0]).json(response[1])
    }

    return res.status(200).json({ customer: CustomerView(response[1]) })
}
