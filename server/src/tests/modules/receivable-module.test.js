const { expect } = require('chai')

const ReceivablesModule = require('../../modules/receivables-module')
const setup = require('../setup')
const testdata = require('../testdata')

describe('Module: Create Receivable', () => {
    setup()

    it('Success: create receivable using correct data', async () => {
        const createdReceivable = await ReceivablesModule.createReceivable({
            ...testdata.receivable1,
            user: '5f9f1c9b9c9c9c9c9c9c9c9c',
        })

        expect(createdReceivable[0]).to.equal(201)
        expect(createdReceivable[1].name).to.equal(testdata.receivable1.name)
        expect(createdReceivable[1].phone).to.equal(testdata.receivable1.phone)
        expect(createdReceivable[1].email).to.equal(testdata.receivable1.email)
        expect(createdReceivable[1].address).to.equal(
            testdata.receivable1.address
        )
    })

    it('Fail: create receivable using invalid data', async () => {
        const createdReceivable = await ReceivablesModule.createReceivable({})
        expect(createdReceivable[0]).to.equal(400)
        expect(createdReceivable[1].errors.name.message).to.equal(
            'Path `name` is required.'
        )
    })
})

describe('Module: List Receivables', () => {
    setup()

    it('Success: list all receivables', async () => {
        await ReceivablesModule.createReceivable({
            ...testdata.receivable1,
            user: '5f9f1c9b9c9c9c9c9c9c9c9c',
        })
        await ReceivablesModule.createReceivable({
            ...testdata.receivable2,
            user: '5f9f1c9b9c9c9c9c9c9c9c9c',
        })
        const receivables = await ReceivablesModule.listReceivables()
        expect(receivables[0]).to.equal(200)
        expect(receivables[1].length).to.equal(2)
    })
})

describe('Module: Get Receivable by id', () => {
    setup()

    it('Success: given correct id', async () => {
        const createdReceivable = await ReceivablesModule.createReceivable({
            ...testdata.receivable1,
            user: '5f9f1c9b9c9c9c9c9c9c9c9c',
        })

        const foundReceivable = await ReceivablesModule.getReceivableById(
            createdReceivable[1]._id
        )

        expect(foundReceivable[0]).to.equal(200)
        expect(foundReceivable[1]._id.toString()).to.equal(
            createdReceivable[1]._id.toString()
        )
    })

    it('Fail: given wrong id', async () => {
        const foundReceivable = await ReceivablesModule.getReceivableById(null)
        expect(foundReceivable[0]).to.equal(404)
        expect(foundReceivable[1]).to.deep.equal({
            message: 'Receivable not found.',
        })
    })
})

describe('Module: Update Receivable', () => {
    setup()

    it('Success: update receivable using correct data', async () => {
        const createdReceivable = await ReceivablesModule.createReceivable({
            ...testdata.receivable1,
            user: '5f9f1c9b9c9c9c9c9c9c9c9c',
        })
        const updatedReceivable = await ReceivablesModule.updateReceivable(
            createdReceivable[1]._id,
            testdata.receivable2
        )

        expect(updatedReceivable[0]).to.equal(200)
        expect(updatedReceivable[1].name).to.equal(testdata.receivable2.name)
        expect(updatedReceivable[1].email).to.equal(testdata.receivable2.email)
        expect(updatedReceivable[1].phone).to.equal(testdata.receivable2.phone)
        expect(updatedReceivable[1].address).to.equal(
            testdata.receivable2.address
        )
    })

    it('Fail: update receivable using invalid data', async () => {
        const createdReceivable = await ReceivablesModule.createReceivable({
            ...testdata.receivable1,
            user: '5f9f1c9b9c9c9c9c9c9c9c9c',
        })
        const updatedReceivable = await ReceivablesModule.updateReceivable(
            createdReceivable[1]._id,
            {
                name: '',
            }
        )

        expect(updatedReceivable[0]).to.equal(400)
        expect(updatedReceivable[1].errors.name.message).to.equal(
            'Path `name` is required.'
        )
    })
})

describe('Module: Delete Receivable', () => {
    setup()

    it('Success: delete receivable using correct id', async () => {
        const createdReceivable = await ReceivablesModule.createReceivable({
            ...testdata.receivable1,
            user: '5f9f1c9b9c9c9c9c9c9c9c9c',
        })
        const deletedReceivable = await ReceivablesModule.deleteReceivable(
            createdReceivable[1]._id
        )
        expect(deletedReceivable[0]).to.equal(200)
        const receivables = await ReceivablesModule.listReceivables()
        expect(receivables[1].length).to.equal(0)
    })
})
