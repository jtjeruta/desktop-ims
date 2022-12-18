const { expect } = require('chai')

const WarehousesModule = require('../../modules/warehouses-module')
const ProductsModule = require('../../modules/products-module')
const setup = require('../setup')
const testdata = require('../testdata')

describe('Modules: Create Warehouse', () => {
    const createdProducts = {}
    setup()
    beforeEach(async () => {
        const product1 = await ProductsModule.createProduct(testdata.product1)
        const product2 = await ProductsModule.createProduct(testdata.product2)
        createdProducts.product1 = product1[1]
        createdProducts.product2 = product2[1]
    })

    it('Success: create warehouse using correct data', async () => {
        const createdWarehouse = await WarehousesModule.createWarehouse(
            testdata.warehouse1
        )

        expect(createdWarehouse[0]).to.equal(201)
        expect(createdWarehouse[1].name).to.equal(testdata.warehouse1.name)
        expect(createdWarehouse[1].quantity).to.equal(
            testdata.warehouse1.quantity
        )
    })

    it('Fail: create warehouse using invalid data', async () => {
        const createdWarehouse = await WarehousesModule.createWarehouse({})

        expect(createdWarehouse[0]).to.equal(400)
        expect(createdWarehouse[1].errors.name.message).to.equal(
            'Path `name` is required.'
        )
    })

    it('Fail: create warehouse using duplicate name', async () => {
        await WarehousesModule.createWarehouse(testdata.warehouse1)

        const createdWarehouse = await WarehousesModule.createWarehouse(
            testdata.warehouse1
        )

        expect(createdWarehouse[0]).to.equal(409)
        expect(createdWarehouse[1].message).to.equal('Duplicate found.')
    })
})

describe('Modules: Update Warehouse', () => {
    const createdWarehouses = {}
    setup()
    beforeEach(async () => {
        const warehouse1 = await WarehousesModule.createWarehouse(
            testdata.warehouse1
        )
        const warehouse2 = await WarehousesModule.createWarehouse(
            testdata.warehouse2
        )
        createdWarehouses.warehouse1 = warehouse1[1]
        createdWarehouses.warehouse2 = warehouse2[1]
    })

    it('Success: update warehouse using correct data', async () => {
        const createdWarehouse = await WarehousesModule.updateWarehouse(
            createdWarehouses.warehouse1._id,
            { name: 'Updated Name' }
        )

        expect(createdWarehouse[0]).to.equal(200)
        expect(createdWarehouse[1].name).to.equal('Updated Name')
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

describe('Modules: sDelete Warehouse By ID', () => {
    let createdWarehouse = null
    setup()
    beforeEach(async () => {
        const warehouse1 = await WarehousesModule.createWarehouse(
            testdata.warehouse1
        )
        createdWarehouse = warehouse1[1]
    })

    it('Success: delete warehouse using id', async () => {
        const deleteVaraint = await WarehousesModule.deleteWarehouseById(
            createdWarehouse._id
        )
        expect(deleteVaraint).to.deep.equal([200])
    })
})

describe('Modules: Get Warehouse By ID', () => {
    let createdWarehouse = null
    setup()
    beforeEach(async () => {
        const warehouse1 = await WarehousesModule.createWarehouse(
            testdata.warehouse1
        )
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

describe('Modules: Update Warehouse Product', () => {
    const created = {}

    setup()
    beforeEach(async () => {
        const product1 = (
            await ProductsModule.createProduct(testdata.product1)
        )[1]
        const product2 = (
            await ProductsModule.createProduct(testdata.product2)
        )[1]
        const warehouse = (
            await WarehousesModule.createWarehouse({
                ...testdata.warehouse1,
                products: [{ source: product1._id, stock: 0 }],
            })
        )[1]

        created.product1 = product1
        created.product2 = product2
        created.warehouse = warehouse
    })

    it('Success: set stock of pre-existing product to 10', async () => {
        const res = await WarehousesModule.updateWarehouseProduct(
            created.warehouse._id,
            created.product1._id,
            10
        )

        expect(res[0]).to.equal(200)
        expect(res[1].products[0].stock).to.equal(10)
        expect(res[1].products[0].source._id.toString()).to.equal(
            created.product1._id.toString()
        )
    })

    it('Success: add product and set stock to 10', async () => {
        const res = await WarehousesModule.updateWarehouseProduct(
            created.warehouse._id,
            created.product2._id,
            10
        )
        expect(res[0]).to.equal(200)
        expect(res[1].products.length).to.equal(2)
        expect(res[1].products[1].stock).to.equal(10)
    })
})
