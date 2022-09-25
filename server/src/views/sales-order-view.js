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
    }))

    return {
        id: document._id,
        customer: CustomerView(document.customer),
        products,
        total: document.total,
        createdAt: document.createdAt,
        remarks: document.remarks,
    }
}
