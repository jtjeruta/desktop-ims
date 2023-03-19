const { ProductView } = require('./product-view')
const { VendorView } = require('./vendor-view')
const { WarehouseView } = require('./warehouse-view')

module.exports.PurchaseOrdersView = (documents) => {
    return documents.map((document) => this.PurchaseOrderView(document))
}

module.exports.PurchaseOrderView = (document) => {
    const products = document.products.map((product) => ({
        id: product.id,
        product: ProductView(product.product),
        itemPrice: product.itemPrice,
        quantity: product.quantity,
        totalPrice: product.totalPrice,
        warehouse: product.warehouse ? WarehouseView(product.warehouse) : null,
        variant: product.variant,
    }))

    return {
        id: document._id,
        vendor: document.vendor ? VendorView(document.vendor) : null,
        products,
        total: document.total,
        createdAt: document.createdAt,
        remarks: document.remarks,
        orderDate: document.orderDate,
        invoiceNumber: document.invoiceNumber,
    }
}
