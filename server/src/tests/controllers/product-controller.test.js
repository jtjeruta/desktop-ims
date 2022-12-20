const { expect, use } = require('chai')
const request = require('supertest')
const deepEqualInAnyOrder = require('deep-equal-in-any-order')

const setup = require('../setup')
const app = require('../../app')
const UsersModule = require('../../modules/users-module')
const ProductsModule = require('../../modules/products-module')
const VariantsModule = require('../../modules/variants-module')
const WarehousesModule = require('../../modules/warehouses-module')
const { login } = require('../helpers')
const testdata = require('../testdata')

use(deepEqualInAnyOrder)

describe('Controller: List products', () => {
    setup()
    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
        await ProductsModule.createProduct(testdata.product1)
        await ProductsModule.createProduct(testdata.product2)
    })

    it('Success: run as admin', (done) => {
        login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        }).then(({ token }) => {
            request(app)
                .get('/api/v1/products')
                .set('Authorization', token)
                .then((res) => {
                    expect(res.statusCode).to.equal(200)
                    expect(res.body.products.length).to.equal(2)
                    done()
                })
                .catch((err) => done(err))
        })
    })

    it('Success: run as employee', (done) => {
        login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        }).then(({ token }) => {
            request(app)
                .get('/api/v1/products')
                .set('Authorization', token)
                .then((res) => {
                    expect(res.statusCode).to.equal(200)
                    expect(res.body.products.length).to.equal(2)
                    done()
                })
                .catch((err) => done(err))
        })
    })

    it('Fail: run as unauthorized', (done) => {
        request(app)
            .get('/api/v1/products')
            .then((res) => {
                expect(res.statusCode).to.equal(401)
                expect(res.body).to.deep.equal({
                    message: 'Unauthorized.',
                })
                done()
            })
            .catch((err) => done(err))
    })
})

describe('Controller: Get product', () => {
    let createdProduct = null

    setup()
    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
        const createProductRes = await ProductsModule.createProduct(
            testdata.product1
        )
        createdProduct = createProductRes[1]
    })

    it('Success: run as admin', (done) => {
        login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        }).then(({ token }) => {
            request(app)
                .get(`/api/v1/products/${createdProduct._id}`)
                .set('Authorization', token)
                .then((res) => {
                    expect(res.statusCode).to.equal(200)
                    expect(res.body.product.name).to.equal(
                        testdata.product1.name
                    )
                    done()
                })
                .catch((err) => done(err))
        })
    })

    it('Fail: run as employee', (done) => {
        login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        }).then(({ token }) => {
            request(app)
                .get(`/api/v1/products/${createdProduct._id}`)
                .set('Authorization', token)
                .then((res) => {
                    expect(res.statusCode).to.equal(401)
                    expect(res.body).to.deep.equal({
                        message: 'Unauthorized.',
                    })
                    done()
                })
                .catch((err) => done(err))
        })
    })

    it('Fail: run as unauthorized', (done) => {
        request(app)
            .get('/api/v1/products')
            .then((res) => {
                expect(res.statusCode).to.equal(401)
                expect(res.body).to.deep.equal({
                    message: 'Unauthorized.',
                })
                done()
            })
            .catch((err) => done(err))
    })
})

describe('Controller: Create product', () => {
    setup()
    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
    })

    it('Success: run as admin with correct data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .post('/api/v1/products')
            .send(testdata.product1)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(201)
        expect(Object.keys(res.body.product)).to.deep.equalInAnyOrder([
            'name',
            'price',
            'published',
            'sku',
            'stock',
            'subCategory',
            'variants',
            'aveUnitCost',
            'company',
            'category',
            'createdAt',
            'id',
            'modifiedAt',
        ])
        expect(res.body.product.aveUnitCost).to.be.null
        expect(res.body.product.published).to.be.false
    })

    it('Success: default variant is created for product', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .post('/api/v1/products')
            .send(testdata.product1)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(201)
        expect(res.body.product.variants.length).to.equal(1)
    })

    it('Fail: run as admin with incorrect data', (done) => {
        login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        }).then(({ token }) => {
            request(app)
                .post('/api/v1/products')
                .send({ price: -1 })
                .set('Authorization', token)
                .then((res) => {
                    expect(res.statusCode).to.equal(400)
                    expect(
                        Object.keys(res.body.errors)
                    ).to.deep.equalInAnyOrder(['name', 'price', 'stock'])
                    done()
                })
                .catch((err) => done(err))
        })
    })

    it('Fail: run as employee', (done) => {
        login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        }).then(({ token }) => {
            request(app)
                .post('/api/v1/products')
                .send({})
                .set('Authorization', token)
                .then((res) => {
                    expect(res.statusCode).to.equal(401)
                    expect(res.body).to.deep.equal({
                        message: 'Unauthorized.',
                    })
                    done()
                })
                .catch((err) => done(err))
        })
    })

    it('Fail: run as unauthorized', (done) => {
        request(app)
            .post('/api/v1/products')
            .then((res) => {
                expect(res.statusCode).to.equal(401)
                expect(res.body).to.deep.equal({
                    message: 'Unauthorized.',
                })
                done()
            })
            .catch((err) => done(err))
    })
})

describe('Controller: Update product', () => {
    const createdProducts = {}

    setup()
    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
        const product1 = await ProductsModule.createProduct(testdata.product1)
        const product2 = await ProductsModule.createProduct(testdata.product2)
        const variant1 = await VariantsModule.createVariant({
            ...testdata.variant1,
            product: product1[1]._id,
        })
        const variant2 = await VariantsModule.createVariant({
            ...testdata.variant1,
            product: product2[1]._id,
        })
        const updatedProduct1 = await ProductsModule.updateProduct(
            product1[1]._id,
            { variants: [variant1[1]._id] }
        )
        const updatedProduct2 = await ProductsModule.updateProduct(
            product2[1]._id,
            { variants: [variant2[1]._id] }
        )
        createdProducts.product1 = updatedProduct1[1]
        createdProducts.product2 = updatedProduct2[1]
    })

    it('Success: run as admin with correct data', (done) => {
        login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        }).then(({ token }) => {
            request(app)
                .put(`/api/v1/products/${createdProducts.product1.id}`)
                .send(testdata.product3)
                .set('Authorization', token)
                .then((res) => {
                    expect(res.statusCode).to.equal(200)
                    expect(res.body.product.name).to.equal(
                        testdata.product3.name
                    )
                    expect(res.body.product.company).to.equal(
                        testdata.product3.company
                    )
                    expect(res.body.product.category).to.equal(
                        testdata.product3.category
                    )
                    expect(res.body.product.subCategory).to.equal(
                        testdata.product3.subCategory
                    )
                    expect(res.body.product.price).to.equal(
                        testdata.product3.price
                    )
                    expect(res.body.product.aveUnitCost).to.equal(
                        createdProducts.product1.aveUnitCost
                    )
                    expect(res.body.product.published).to.equal(
                        testdata.product3.published
                    )
                    expect(res.body.product.variants[0].name).to.equal(
                        testdata.variant1.name
                    )
                    expect(res.body.product.variants[0].quantity).to.equal(
                        testdata.variant1.quantity
                    )
                    expect(Object.keys(res.body.product)).to.include('id')
                    done()
                })
                .catch((err) => done(err))
        })
    })

    it('Fail: run as admin with incorrect data', (done) => {
        login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        }).then(({ token }) => {
            request(app)
                .put(`/api/v1/products/${createdProducts.product1.id}`)
                .send({
                    name: '',
                    company: '',
                    category: '',
                    subCategory: '',
                    published: null,
                    price: -1,
                })
                .set('Authorization', token)
                .then((res) => {
                    expect(res.statusCode).to.equal(400)
                    expect(
                        Object.keys(res.body.errors)
                    ).to.deep.equalInAnyOrder(['name', 'published', 'price'])
                    done()
                })
                .catch((err) => done(err))
        })
    })

    it('Fail: run as employee', (done) => {
        login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        }).then(({ token }) => {
            request(app)
                .put(`/api/v1/products/${createdProducts.product1.id}`)
                .send({})
                .set('Authorization', token)
                .then((res) => {
                    expect(res.statusCode).to.equal(401)
                    expect(res.body).to.deep.equal({
                        message: 'Unauthorized.',
                    })
                    done()
                })
                .catch((err) => done(err))
        })
    })

    it('Fail: run as unauthorized', (done) => {
        request(app)
            .put(`/api/v1/products/${createdProducts.product1.id}`)
            .then((res) => {
                expect(res.statusCode).to.equal(401)
                expect(res.body).to.deep.equal({
                    message: 'Unauthorized.',
                })
                done()
            })
            .catch((err) => done(err))
    })
})

describe('Controller: Transfer stock', () => {
    const created = {}

    setup()
    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)

        const product1 = await ProductsModule.createProduct(testdata.product1)
        const product2 = await ProductsModule.createProduct(testdata.product2)
        const warehouse1 = await WarehousesModule.createWarehouse({
            ...testdata.warehouse1,
            products: [{ source: product1[1]._id, stock: 10 }],
        })
        const warehouse2 = await WarehousesModule.createWarehouse(
            testdata.warehouse2
        )

        created.product1 = product1[1]
        created.product2 = product2[1]
        created.warehouse1 = warehouse1[1]
        created.warehouse2 = warehouse2[1]
    })

    it('Success: transfer warehouse stock to store', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .put(`/api/v1/products/${created.product1._id}/transfer-stock`)
            .send({
                transferFrom: created.warehouse1._id,
                transferTo: 'store',
                amount: 10,
            })
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body.product.stock).to.equal(10)

        const warehouseRes = await WarehousesModule.getWarehouseById(
            created.warehouse1._id
        )

        expect(warehouseRes[1].products[0].source._id.toString()).to.equal(
            created.product1._id.toString()
        )

        expect(warehouseRes[1].products[0].stock).to.equal(0)
    })

    it('Success: transfer warehouse stock to another warehouse', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .put(`/api/v1/products/${created.product1.id}/transfer-stock`)
            .send({
                transferFrom: created.warehouse1._id,
                transferTo: created.warehouse2._id,
                amount: 8,
            })
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body.product.stock).to.equal(0)

        const warehouse1Res = await WarehousesModule.getWarehouseById(
            created.warehouse1._id
        )

        expect(warehouse1Res[1].products[0].stock).to.equal(2)

        const warehouse2Res = await WarehousesModule.getWarehouseById(
            created.warehouse2._id
        )

        expect(warehouse2Res[1].products[0].stock).to.equal(8)
    })

    it('Fail: transfer warehouse stock to non existing warehouse', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .put(`/api/v1/products/${created.product1.id}/transfer-stock`)
            .send({
                transferFrom: created.warehouse1._id,
                transferTo: null,
                amount: 5,
            })
            .set('Authorization', token)

        expect(res.statusCode).to.equal(404)
        expect(res.body.errors.transferTo.message).to.equal(
            'Destination not found.'
        )
    })

    it('Fail: transfer warehouse stock to wrong product', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .put(`/api/v1/products/wrong-product-id/transfer-stock`)
            .send({
                transferFrom: created.warehouse1._id,
                transferTo: 'store',
                amount: 5,
            })
            .set('Authorization', token)

        expect(res.statusCode).to.equal(404)
        expect(res.body.errors.transferTo.message).to.equal(
            'Destination not found.'
        )
    })

    it('Fail: transfer warehouse stock to same warehouse', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .put(`/api/v1/products/wrong-product-id/transfer-stock`)
            .send({
                transferFrom: created.warehouse1._id,
                transferTo: created.warehouse1._id,
                amount: 5,
            })
            .set('Authorization', token)

        expect(res.statusCode).to.equal(400)
        expect(res.body.errors.transferTo.message).to.equal(
            'Source is same as destination.'
        )
    })

    it('Fail: transfer 0 amount of stock', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .put(`/api/v1/products/wrong-product-id/transfer-stock`)
            .send({
                transferFrom: created.warehouse1._id,
                transferTo: created.warehouse2._id,
                amount: 0,
            })
            .set('Authorization', token)

        expect(res.statusCode).to.equal(400)
        expect(res.body.errors.amount.message).to.equal(
            'Must be greater than 0.'
        )
    })

    it('Fail: transfer amount that is greater than warehouse quantity', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .put(`/api/v1/products/${created.product1._id}/transfer-stock`)
            .send({
                transferFrom: created.warehouse1._id,
                transferTo: created.warehouse2._id,
                amount: 100,
            })
            .set('Authorization', token)

        expect(res.statusCode).to.equal(400)
        expect(res.body.message).to.equal(
            'Transfer amount is greater than stored quantity.'
        )
    })

    it('Fail: run as employee', async () => {
        const { token } = await login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        })

        const res = await request(app)
            .put(`/api/v1/products/wrong-product-id/transfer-stock`)
            .send({
                transferFrom: created.warehouse1._id,
                transferTo: created.warehouse2._id,
                amount: 100,
            })
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body.message).to.equal('Unauthorized.')
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app)
            .put(`/api/v1/products/wrong-product-id/transfer-stock`)
            .send({
                transferFrom: created.warehouse1._id,
                transferTo: created.warehouse2._id,
                amount: 100,
            })

        expect(res.statusCode).to.equal(401)
        expect(res.body.message).to.equal('Unauthorized.')
    })
})
