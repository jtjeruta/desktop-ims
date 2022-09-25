module.exports.CustomersView = (customerDocuments) => {
    return customerDocuments.map((customerDocument) =>
        this.CustomerView(customerDocument)
    )
}

module.exports.CustomerView = (customerDocument) => {
    return {
        id: customerDocument._id,
        name: customerDocument.name,
        email: customerDocument.email,
        phone: customerDocument.phone,
        address: customerDocument.address,
    }
}
