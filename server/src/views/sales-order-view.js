const { ProductView } = require('./product-view')
const { CustomerView } = require('./customer-view')
const { WarehouseView } = require('./warehouse-view')

module.exports.SalesOrdersView = (documents) => {
    return documents.map((document) => this.SalesOrderView(document))
}

module.exports.SalesOrderView = (document) => {
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
        customer: document.customer ? CustomerView(document.customer) : null,
        products,
        total: document.total,
        createdAt: document.createdAt,
        remarks: document.remarks,
        orderDate: document.orderDate,
        invoiceNumber: document.invoiceNumber,
    }
}
