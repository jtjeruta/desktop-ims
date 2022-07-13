const { expect } = require('chai')

const WarehousesModule = require('../../modules/warehouses-module')
const ProductsModule = require('../../modules/products-module')
const setup = require('../setup')
const testdata = require('../testdata')

describe('Create Warehouse', () => {
    const createdProducts = {}
    setup()
    beforeEach(async () => {
        const product1 = await ProductsModule.createProduct(testdata.product1)
        const product2 = await ProductsModule.createProduct(testdata.product2)
        createdProducts.product1 = product1[1]
        createdProducts.product2 = product2[1]
    })

    it('Success: create warehouse using correct data', async () => {
        const createdWarehouse = await WarehousesModule.createWarehouse({
            ...testdata.warehouse1,
            product: createdProducts.product1._id,
        })

        expect(createdWarehouse[0]).to.equal(201)
        expect(createdWarehouse[1].name).to.equal(testdata.warehouse1.name)
        expect(createdWarehouse[1].quantity).to.equal(
            testdata.warehouse1.quantity
        )
    })

    it('Fail: create warehouse using invalid data', async () => {
        const createdWarehouse = await WarehousesModule.createWarehouse({
            quantity: -2,
        })

        expect(createdWarehouse[0]).to.equal(400)
        expect(createdWarehouse[1].errors.name.message).to.equal(
            'Path `name` is required.'
        )
        expect(createdWarehouse[1].errors.quantity.message).to.equal(
            'Path `quantity` can not be less than 0.'
        )
        expect(createdWarehouse[1].errors.product.message).to.equal(
            'Path `product` is required.'
        )
    })

    it('Fail: create warehouse using duplicate name', async () => {
        await WarehousesModule.createWarehouse({
            ...testdata.warehouse1,
            product: createdProducts.product1._id,
        })

        const createdWarehouse = await WarehousesModule.createWarehouse({
            ...testdata.warehouse1,
            product: createdProducts.product1._id,
        })

        expect(createdWarehouse[0]).to.equal(409)
        expect(createdWarehouse[1].message).to.equal('Duplicate found.')
    })

    it('Success: create warehouse using duplicate name but different product', async () => {
        await WarehousesModule.createWarehouse({
            ...testdata.warehouse1,
            product: createdProducts.product1._id,
        })

        const createdWarehouse = await WarehousesModule.createWarehouse({
            ...testdata.warehouse1,
            product: createdProducts.product2._id,
        })

        expect(createdWarehouse[0]).to.equal(201)
    })
})

describe('Update Warehouse', () => {
    const createdWarehouses = {}
    setup()
    beforeEach(async () => {
        const product = await ProductsModule.createProduct(testdata.product1)
        const warehouse1 = await WarehousesModule.createWarehouse({
            ...testdata.warehouse1,
            product: product[1]._id,
        })
        const warehouse2 = await WarehousesModule.createWarehouse({
            ...testdata.warehouse2,
            product: product[1]._id,
        })
        createdWarehouses.warehouse1 = warehouse1[1]
        createdWarehouses.warehouse2 = warehouse2[1]
    })

    it('Success: update warehouse using correct data', async () => {
        const createdWarehouse = await WarehousesModule.updateWarehouse(
            createdWarehouses.warehouse1._id,
            {
                name: 'Updated Name',
                quantity: 100,
            }
        )

        expect(createdWarehouse[0]).to.equal(200)
        expect(createdWarehouse[1].name).to.equal('Updated Name')
        expect(createdWarehouse[1].quantity).to.equal(100)
    })

    it('Fail: update warehouse using invalid data', async () => {
        const updatedWarehouse = await WarehousesModule.updateWarehouse(
            createdWarehouses.warehouse1._id,
            {
                name: null,
                quantity: -2,
            }
        )

        expect(updatedWarehouse[0]).to.equal(400)
        expect(updatedWarehouse[1].errors.name.message).to.equal(
            'Path `name` is required.'
        )
        expect(updatedWarehouse[1].errors.quantity.message).to.equal(
            'Path `quantity` can not be less than 0.'
        )
    })

    it('Fail: update warehouse using duplicate name', async () => {
        const updatedWarehouse = await WarehousesModule.updateWarehouse(
            createdWarehouses.warehouse1._id,
            {
                ...testdata.warehouse2,
            }
        )

        expect(updatedWarehouse[0]).to.equal(409)
        expect(updatedWarehouse[1].message).to.equal('Duplicate found.')
    })
})

describe('Delete Warehouse By ID', () => {
    let createdWarehouse = null
    setup()
    beforeEach(async () => {
        const product1 = await ProductsModule.createProduct(testdata.product1)
        const warehouse1 = await WarehousesModule.createWarehouse({
            ...testdata.warehouse1,
            product: product1[1]._id,
        })
        createdWarehouse = warehouse1[1]
    })

    it('Success: delete warehouse using id', async () => {
        const deleteVaraint = await WarehousesModule.deleteWarehouseById(
            createdWarehouse._id
        )
        expect(deleteVaraint).to.deep.equal([200])
    })
})

describe('Get Warehouse By ID', () => {
    let createdWarehouse = null
    setup()
    beforeEach(async () => {
        const product1 = await ProductsModule.createProduct(testdata.product1)
        const warehouse1 = await WarehousesModule.createWarehouse({
            ...testdata.warehouse1,
            product: product1[1]._id,
        })
        createdWarehouse = warehouse1[1]
    })

    it('Success: get warehouse using correct id', async () => {
        const res = await WarehousesModule.getWarehouseById(
            createdWarehouse._id
        )
        expect(res[0]).to.equal(200)
        expect(res[1].name).to.equal(createdWarehouse.name)
        expect(res[1].quantity).to.equal(createdWarehouse.quantity)
    })

    it('Fail: get warehouse using incorrect id', async () => {
        const res = await WarehousesModule.getWarehouseById(null)
        expect(res).to.deep.equal([404, { message: 'Warehouse not found.' }])
    })
})
