const VendorsModule = require('../modules/vendors-module')
const { VendorsView } = require('../views/vendor-view')

module.exports.listVendors = async (req, res) => {
    const vendorsRes = await VendorsModule.listVendors()

    if (!vendorsRes[0] === 200) {
        return res.status(vendorsRes[0]).json(vendorsRes[1])
    }

    return res.status(200).json({ vendors: VendorsView(vendorsRes[1]) })
}
