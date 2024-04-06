const moment = require('moment')
const { getMongoError } = require('../lib/mongo-errors')
const { VendorModel } = require('../schemas/vendor-schema')

module.exports.createVendor = async (data, session = null) => {
    const doc = {
        ...data,
        createdAt: moment().unix(),
        modifiedAt: moment().unix(),
    }

    const vendor = new VendorModel(doc)

    try {
        const createdVendor = await (session
            ? vendor.save({ session })
            : vendor.save())
        return [201, createdVendor]
    } catch (error) {
        console.error('Failed to create vendor: ', error)
        return getMongoError(error)
    }
}

module.exports.listVendors = async (query = {}) => {
    try {
        const vendors = await VendorModel.find(query)
        return [200, vendors]
    } catch (error) {
        console.error('Failed to list vendors: ', error)
        return getMongoError(error)
    }
}

module.exports.updateVendor = async (id, data) => {
    const doc = {
        ...data,
        modifiedAt: moment().unix(),
    }

    try {
        const updatedVendor = await VendorModel.findByIdAndUpdate(
            { _id: id },
            { $set: doc },
            { new: true, runValidators: true }
        )
        return [200, updatedVendor]
    } catch (error) {
        console.error('Failed to update vendor: ', error)
        return getMongoError(error)
    }
}

module.exports.getVendorById = async (id, session = null) => {
    try {
        const vendor = await VendorModel.findById(id).session(session)

        if (!vendor) return [404, { message: 'Vendor not found.' }]
        return [200, vendor]
    } catch (error) {
        console.error('Failed to get vendor by id: ', error)
        return getMongoError(error)
    }
}

module.exports.archiveVendorById = async (vendorId, session = null) => {
    try {
        await VendorModel.findByIdAndUpdate(
            { _id: vendorId },
            { $set: { archived: true } },
            { new: true, runValidators: true }
        ).session(session)
        return [200]
    } catch (error) {
        console.error('Failed to archive vendor by id: ', error)
        return getMongoError(error)
    }
}

module.exports.deleteVendors = async (query = {}, session = null) => {
    try {
        await VendorModel.deleteMany(query).session(session)
        return [200]
    } catch (error) {
        console.error('Failed to delete vendors: ', error)
        return getMongoError(error)
    }
}
