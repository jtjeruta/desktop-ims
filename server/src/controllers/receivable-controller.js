const ReceivablesModule = require('../modules/receivables-module')
const { ReceivablesView, ReceivableView } = require('../views/receivable-view')

module.exports.listReceivables = async (req, res) => {
    const receivablesRes = await ReceivablesModule.listReceivables()

    if (receivablesRes[0] !== 200) {
        return res.status(receivablesRes[0]).json(receivablesRes[1])
    }

    return res
        .status(200)
        .json({ receivables: ReceivablesView(receivablesRes[1]) })
}

module.exports.createReceivable = async (req, res) => {
    const userId = req.con._id
    const response = await ReceivablesModule.createReceivable({
        ...req.body,
        user: userId,
    })

    if (response[0] !== 201) {
        return res.status(response[0]).json(response[1])
    }

    return res.status(201).json({ receivable: ReceivableView(response[1]) })
}

module.exports.updateReceivable = async (req, res) => {
    const { receivableId } = req.params
    const response = await ReceivablesModule.updateReceivable(
        receivableId,
        req.body
    )

    if (response[0] !== 200) {
        return res.status(response[0]).json(response[1])
    }

    return res.status(200).json({ receivable: ReceivableView(response[1]) })
}

module.exports.deleteReceivable = async (req, res) => {
    const { receivableId } = req.params
    const response = await ReceivablesModule.deleteReceivable(receivableId)
    return res.status(response[0]).json(response[1])
}
