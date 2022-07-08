const { expect } = require('chai')

const VariantsModule = require('../../modules/variants-module')
const ProductsModule = require('../../modules/products-module')
const setup = require('../setup')
const testdata = require('../testdata')

describe('Create Variant', () => {
    const createdProducts = {}
    setup()
    beforeEach(async () => {
        const product1 = await ProductsModule.createProduct(testdata.product1)
        const product2 = await ProductsModule.createProduct(testdata.product2)
        createdProducts.product1 = product1[1]
        createdProducts.product2 = product2[1]
    })

    it('Success: create variant using correct data', async () => {
        const createdVariant = await VariantsModule.createVariant({
            ...testdata.variant1,
            product: createdProducts.product1._id,
        })

        expect(createdVariant[0]).to.equal(201)
        expect(createdVariant[1].name).to.equal(testdata.variant1.name)
        expect(createdVariant[1].quantity).to.equal(testdata.variant1.quantity)
    })

    it('Fail: create variant using invalid data', async () => {
        const createdVariant = await VariantsModule.createVariant({
            quantity: -2,
        })

        expect(createdVariant[0]).to.equal(400)
        expect(createdVariant[1].errors.name.message).to.equal(
            'Path `name` is required.'
        )
        expect(createdVariant[1].errors.quantity.message).to.equal(
            'Path `quantity` can not be less than 0.'
        )
        expect(createdVariant[1].errors.product.message).to.equal(
            'Path `product` is required.'
        )
    })

    it('Fail: create variant using duplicate name', async () => {
        await VariantsModule.createVariant({
            ...testdata.variant1,
            product: createdProducts.product1._id,
        })

        const createdVariant = await VariantsModule.createVariant({
            ...testdata.variant1,
            product: createdProducts.product1._id,
        })

        expect(createdVariant[0]).to.equal(409)
        expect(createdVariant[1].message).to.equal('Duplicate found.')
    })

    it('Success: create variant using duplicate name but different product', async () => {
        await VariantsModule.createVariant({
            ...testdata.variant1,
            product: createdProducts.product1._id,
        })

        const createdVariant = await VariantsModule.createVariant({
            ...testdata.variant1,
            product: createdProducts.product2._id,
        })

        expect(createdVariant[0]).to.equal(201)
    })
})

describe('Delete Variant By ID', () => {
    let createdVariant = null
    setup()
    beforeEach(async () => {
        const product1 = await ProductsModule.createProduct(testdata.product1)
        const variant1 = await VariantsModule.createVariant({
            ...testdata.variant1,
            product: product1[1]._id,
        })
        createdVariant = variant1[1]
    })

    it('Success: delete variant using id', async () => {
        const deleteVaraint = await VariantsModule.deleteVariantById(
            createdVariant._id
        )
        expect(deleteVaraint).to.deep.equal([200])
    })
})
