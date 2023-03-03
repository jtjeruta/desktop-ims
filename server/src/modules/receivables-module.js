const moment = require('moment')
const { getMongoError } = require('../lib/mongo-errors')
const { ReceivableModel } = require('../schemas/receivable-schema')

module.exports.createReceivable = async (data, session = null) => {
    const doc = {
        ...data,
        createdAt: moment().unix(),
        modifiedAt: moment().unix(),
    }

    const receivable = new ReceivableModel(doc)

    try {
        const createdReceivable = await (session
            ? receivable.save({ session })
            : receivable.save())
        return [201, createdReceivable]
    } catch (error) {
        console.error('Failed to create receivable')
        return getMongoError(error)
    }
}

module.exports.listReceivables = async (query = {}, session = null) => {
    try {
        const receivables = await ReceivableModel.find(query)
            .sort({ date: -1 })
            .populate('user')
            .session(session)

        return [200, receivables]
    } catch (error) {
        console.error('Failed to list receivables')
        return getMongoError(error)
    }
}

module.exports.updateReceivable = async (id, data, session) => {
    const doc = {
        ...data,
        modifiedAt: moment().unix(),
    }

    try {
        const updatedReceivable = await ReceivableModel.findByIdAndUpdate(
            { _id: id },
            { $set: doc },
            { new: true, runValidators: true, session }
        )
        return [200, updatedReceivable]
    } catch (error) {
        console.error('Failed to update receivable')
        return getMongoError(error)
    }
}

module.exports.getReceivableById = async (id, session) => {
    try {
        const receivable = await ReceivableModel.findById(id)
            .populate('user')
            .session(session)

        if (!receivable) return [404, { message: 'Receivable not found.' }]
        return [200, receivable]
    } catch (error) {
        console.error('Failed to get receivable by id')
        return getMongoError(error)
    }
}

module.exports.deleteReceivable = async (id, session = null) => {
    try {
        await ReceivableModel.findByIdAndDelete(id).session(session)
        return [200]
    } catch (error) {
        console.error('Failed to delete receivable')
        return getMongoError(error)
    }
}

module.exports.deleteReceivables = async (query = {}, session) => {
    try {
        await ReceivableModel.deleteMany(query).session(session)
        return [200]
    } catch (error) {
        console.error('Failed to delete receivables')
        return getMongoError(error)
    }
}
