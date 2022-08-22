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
    const response = await VendorsModule.createVendor(req.body)

    if (response[0] !== 201) {
        return res.status(response[0]).json(response[1])
    }

    return res.status(201).json({ vendor: VendorView(response[1]) })
}
