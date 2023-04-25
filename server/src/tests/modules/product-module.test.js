const { expect } = require('chai')

const ProductsModule = require('../../modules/products-module')
const setup = require('../setup')
const testdata = require('../testdata')

describe('Module: Create Product', () => {
    setup()

    it('Success: create product using correct data', async () => {
        const createdProduct = await ProductsModule.createProduct(
            testdata.product1
        )

        expect(createdProduct[0]).to.equal(201)
        expect(createdProduct[1].name).to.equal(testdata.product1.name)
        expect(createdProduct[1].company).to.equal(testdata.product1.company)
        expect(createdProduct[1].category).to.equal(testdata.product1.category)
        expect(createdProduct[1].subCategory).to.equal(
            testdata.product1.subCategory
        )
        expect(createdProduct[1].sellingPrice).to.equal(
            testdata.product1.sellingPrice
        )
        expect(createdProduct[1].costPrice).to.equal(
            testdata.product1.costPrice
        )
        expect(createdProduct[1].reorderPoint).to.equal(
            testdata.product1.reorderPoint
        )
        expect(createdProduct[1].published).to.equal(
            testdata.product1.published
        )
        expect(createdProduct[1].variants).to.deep.equal([])
    })

    it('Fail: create product using invalid data', async () => {
        const createdProduct = await ProductsModule.createProduct({
            sellingPrice: -1,
            costPrice: -1,
            reorderPoint: -1,
        })
        expect(createdProduct[0]).to.equal(400)
        expect(createdProduct[1].errors.name.message).to.equal(
            'Path `name` is required.'
        )
        expect(createdProduct[1].errors.sellingPrice.message).to.equal(
            'path selling price can not be less than 0.'
        )
        expect(createdProduct[1].errors.costPrice.message).to.equal(
            'path cost price can not be less than 0.'
        )
        expect(createdProduct[1].errors.reorderPoint.message).to.equal(
            'path reorder point can not be less than 0.'
        )
        expect(createdProduct[1].errors.published.message).to.equal(
            'Path `published` is required.'
        )
    })
})

describe('Module: List Products', () => {
    setup()

    it('Success: list all products', async () => {
        await ProductsModule.createProduct(testdata.product1)
        await ProductsModule.createProduct(testdata.product2)
        const products = await ProductsModule.listProducts()
        expect(products[0]).to.equal(200)
        expect(products[1].length).to.equal(2)
    })
})

describe('Module: Get Product by id', () => {
    setup()

    it('Success: given correct id', async () => {
        const createdProduct = await ProductsModule.createProduct(
            testdata.product1
        )

        const foundProduct = await ProductsModule.getProductById(
            createdProduct[1]._id
        )

        expect(foundProduct[0]).to.equal(200)
        expect(foundProduct[1]._id.toString()).to.equal(
            createdProduct[1]._id.toString()
        )
    })

    it('Fail: given wrong id', async () => {
        const foundProduct = await ProductsModule.getProductById(null)
        expect(foundProduct[0]).to.equal(404)
        expect(foundProduct[1]).to.deep.equal({ message: 'Product not found.' })
    })
})

describe('Module: Update Product', () => {
    setup()

    it('Success: update product using correct data', async () => {
        const createdProduct = await ProductsModule.createProduct(
            testdata.product1
        )
        const updatedProduct = await ProductsModule.updateProduct(
            createdProduct[1]._id,
            testdata.product2
        )

        expect(updatedProduct[0]).to.equal(200)
        expect(updatedProduct[1].name).to.equal(testdata.product2.name)
        expect(updatedProduct[1].company).to.equal(testdata.product2.company)
        expect(updatedProduct[1].category).to.equal(testdata.product2.category)
        expect(updatedProduct[1].subCategory).to.equal(
            testdata.product2.subCategory
        )
        expect(updatedProduct[1].sellingPrice).to.equal(
            testdata.product2.sellingPrice
        )
        expect(updatedProduct[1].costPrice).to.equal(
            testdata.product2.costPrice
        )
        expect(updatedProduct[1].reorderPoint).to.equal(
            testdata.product2.reorderPoint
        )
        expect(updatedProduct[1].published).to.equal(
            testdata.product2.published
        )
        expect(updatedProduct[1]._id.toString()).to.equal(
            createdProduct[1]._id.toString()
        )
    })

    it('Fail: update product using invalid data', async () => {
        const createdProduct = await ProductsModule.createProduct(
            testdata.product1
        )
        const updatedProduct = await ProductsModule.updateProduct(
            createdProduct[1]._id,
            { sellingPrice: -1, costPrice: -1, reorderPoint: -1 }
        )

        expect(updatedProduct[0]).to.equal(400)
        expect(updatedProduct[1].errors.sellingPrice.message).to.equal(
            'path selling price can not be less than 0.'
        )
        expect(updatedProduct[1].errors.costPrice.message).to.equal(
            'path cost price can not be less than 0.'
        )
        expect(updatedProduct[1].errors.reorderPoint.message).to.equal(
            'path reorder point can not be less than 0.'
        )
    })
})

describe('Module: Generate SKU', () => {
    it('Suceess: returns 8 characters composed of capital letters and numbers', async () => {
        const sku = ProductsModule.generateSKU()
        const regex = /^[A-Z 0-9]{8}$/
        expect(regex.test(sku)).to.be.true
    })
})
