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

describe('Create variant', () => {
    let createdProduct = null
    setup()
    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
        const productRes = await ProductsModule.createProduct(testdata.product1)
        createdProduct = productRes[1]
    })

    it('Success: run as admin with correct data', (done) => {
        login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        }).then(({ token }) => {
            request(app)
                .post(`/api/v1/products/${createdProduct._id}/variants`)
                .send(testdata.variant1)
                .set('Authorization', token)
                .then((res) => {
                    expect(res.statusCode).to.equal(201)
                    expect(res.body.variant.name).to.equal(
                        testdata.variant1.name
                    )
                    expect(res.body.variant.quantity).to.equal(
                        testdata.variant1.quantity
                    )
                    done()
                })
                .catch((err) => done(err))
        })
    })

    it('Success: variants fetched along with product', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        await request(app)
            .post(`/api/v1/products/${createdProduct._id}/variants`)
            .send(testdata.variant1)
            .set('Authorization', token)

        const res = await request(app)
            .get(`/api/v1/products/${createdProduct._id}`)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body.product.variants.length).to.equal(1)
        expect(res.body.product.variants[0].name).to.equal(
            testdata.variant1.name
        )
        expect(res.body.product.variants[0].quantity).to.equal(
            testdata.variant1.quantity
        )
    })

    it('Fail: run as admin with incorrect data', (done) => {
        login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        }).then(({ token }) => {
            request(app)
                .post(`/api/v1/products/${createdProduct._id}/variants`)
                .send({})
                .set('Authorization', token)
                .then((res) => {
                    expect(res.statusCode).to.equal(400)
                    expect(
                        Object.keys(res.body.errors)
                    ).to.deep.equalInAnyOrder(['name', 'quantity'])
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
                .post(`/api/v1/products/${createdProduct._id}/variants`)
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
            .post(`/api/v1/products/${createdProduct._id}/variants`)
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

describe('Delete variant', () => {
    let createdVariant = null
    setup()
    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
        const productRes = await ProductsModule.createProduct(testdata.product1)
        const variantRes = await VariantsModule.createVariant({
            ...testdata.variant1,
            product: productRes[1]._id,
        })
        await ProductsModule.updateProduct(productRes[1]._id, {
            variants: [variantRes[1]._id],
        })
        createdVariant = variantRes[1]
    })

    it('Success: run as admin', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .delete(`/api/v1/variants/${createdVariant._id}`)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body).to.deep.equal({ message: 'Variant deleted.' })
    })

    it('Success: variant is deleted from product object as well', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        await request(app)
            .delete(`/api/v1/variants/${createdVariant._id}`)
            .set('Authorization', token)

        const res = await request(app)
            .get(`/api/v1/products/${createdVariant.product}`)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body.product.variants.length).to.equal(0)
    })

    it('Fail: run as employee', (done) => {
        login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        }).then(({ token }) => {
            request(app)
                .delete(`/api/v1/variants/${createdVariant._id}`)
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
            .delete(`/api/v1/variants/${createdVariant._id}`)
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
