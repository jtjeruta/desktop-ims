module.exports.ReceivablesView = (receivableDocuments) => {
    return receivableDocuments.map((receivableDocument) =>
        this.ReceivableView(receivableDocument)
    )
}

module.exports.ReceivableView = (receivableDocument) => {
    return {
        id: receivableDocument._id,
        name: receivableDocument.name,
        description: receivableDocument.description,
        date: receivableDocument.date,
        amount: receivableDocument.amount,
    }
}
