const { expect, use } = require('chai')
const request = require('supertest')
const deepEqualInAnyOrder = require('deep-equal-in-any-order')

const setup = require('../setup')
const app = require('../../app')
const UsersModule = require('../../modules/users-module')
const ProductsModule = require('../../modules/products-module')
const VariantsModule = require('../../modules/variants-module')
const { login } = require('../helpers')
const testdata = require('../testdata')

use(deepEqualInAnyOrder)

describe('List products', () => {
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

describe('Get product', () => {
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

describe('Create product', () => {
    setup()
    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
    })

    it('Success: run as admin with correct data', (done) => {
        login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        }).then(({ token }) => {
            request(app)
                .post('/api/v1/products')
                .send(testdata.product1)
                .set('Authorization', token)
                .then((res) => {
                    expect(res.statusCode).to.equal(201)
                    expect(
                        Object.keys(res.body.product)
                    ).to.deep.equalInAnyOrder([
                        'name',
                        'price',
                        'published',
                        'sku',
                        'storeQty',
                        'subCategory',
                        'variants',
                        'warehouses',
                        'aveUnitCost',
                        'brand',
                        'category',
                        'createdAt',
                        'id',
                        'modifiedAt',
                    ])
                    expect(res.body.product.aveUnitCost).to.be.null
                    expect(res.body.product.published).to.be.false
                    done()
                })
                .catch((err) => done(err))
        })
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
                    ).to.deep.equalInAnyOrder([
                        'name',
                        'brand',
                        'category',
                        'subCategory',
                        'price',
                        'storeQty',
                    ])
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

describe('Update product', () => {
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
                    expect(res.body.product.brand).to.equal(
                        testdata.product3.brand
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
                    brand: '',
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
                    ).to.deep.equalInAnyOrder([
                        'name',
                        'brand',
                        'category',
                        'subCategory',
                        'published',
                        'price',
                    ])
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
