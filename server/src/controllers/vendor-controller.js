const { default: mongoose } = require('mongoose')
const VendorsModule = require('../modules/vendors-module')
const { VendorsView, VendorView } = require('../views/vendor-view')

module.exports.listVendors = async (req, res) => {
    const vendorsRes = await VendorsModule.listVendors()

    if (vendorsRes[0] !== 200) {
        return res.status(vendorsRes[0]).json(vendorsRes[1])
    }

    return res.status(200).json({ vendors: VendorsView(vendorsRes[1]) })
}

module.exports.createVendor = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    const response = await VendorsModule.createVendor(req.body, session)

    if (response[0] !== 201) {
        await session.endSession()
        return res.status(response[0]).json(response[1])
    }

    await session.commitTransaction()
    await session.endSession()
    return res.status(201).json({ vendor: VendorView(response[1]) })
}

module.exports.updateVendor = async (req, res) => {
    const { vendorId } = req.params
    const response = await VendorsModule.updateVendor(vendorId, req.body)

    if (response[0] !== 200) {
        return res.status(response[0]).json(response[1])
    }

    return res.status(200).json({ vendor: VendorView(response[1]) })
}

module.exports.deleteVendor = async (req, res) => {
    const { vendorId } = req.params

    const vendorRes = await VendorsModule.deleteVendorById(vendorId)

    if (vendorRes[0] !== 200) {
        return res.status(vendorRes[0]).json(vendorRes[1])
    }

    return res.status(200).json({ message: 'Vendor deleted successfully.' })
}
