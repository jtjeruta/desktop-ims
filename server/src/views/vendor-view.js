module.exports.VendorsView = (vendorDocuments) => {
    return vendorDocuments.map((vendorDocument) =>
        this.VendorView(vendorDocument)
    )
}

module.exports.VendorView = (vendorDocument) => {
    return {
        id: vendorDocument._id,
        name: vendorDocument.name,
        email: vendorDocument.email,
        phone: vendorDocument.phone,
        address: vendorDocument.address,
        remarks: vendorDocument.remarks,
        archived: vendorDocument.archived,
    }
}
