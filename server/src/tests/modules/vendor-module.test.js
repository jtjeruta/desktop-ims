const { expect } = require('chai')

const VendorsModule = require('../../modules/vendors-module')
const setup = require('../setup')
const testdata = require('../testdata')

describe('Module: Create Vendor', () => {
    setup()

    it('Success: create vendor using correct data', async () => {
        const createdVendor = await VendorsModule.createVendor(testdata.vendor1)

        expect(createdVendor[0]).to.equal(201)
        expect(createdVendor[1].name).to.equal(testdata.vendor1.name)
        expect(createdVendor[1].phone).to.equal(testdata.vendor1.phone)
        expect(createdVendor[1].email).to.equal(testdata.vendor1.email)
        expect(createdVendor[1].address).to.equal(testdata.vendor1.address)
    })

    it('Fail: create vendor using invalid data', async () => {
        const createdVendor = await VendorsModule.createVendor({})
        expect(createdVendor[0]).to.equal(400)
        expect(createdVendor[1].errors.name.message).to.equal(
            'Path `name` is required.'
        )
    })

    it('Fail: create vendor using duplicate name', async () => {
        await VendorsModule.createVendor(testdata.vendor1)
        const createdVendor = await VendorsModule.createVendor(testdata.vendor1)
        expect(createdVendor[0]).to.equal(409)
        expect(createdVendor[1].message).to.equal('Duplicate found.')
    })
})

describe('Module: List Vendors', () => {
    setup()

    it('Success: list all vendors', async () => {
        await VendorsModule.createVendor(testdata.vendor1)
        await VendorsModule.createVendor(testdata.vendor2)
        const vendors = await VendorsModule.listVendors()
        expect(vendors[0]).to.equal(200)
        expect(vendors[1].length).to.equal(2)
    })
})

describe('Module: Get Vendor by id', () => {
    setup()

    it('Success: given correct id', async () => {
        const createdVendor = await VendorsModule.createVendor(testdata.vendor1)

        const foundVendor = await VendorsModule.getVendorById(
            createdVendor[1]._id
        )

        expect(foundVendor[0]).to.equal(200)
        expect(foundVendor[1]._id.toString()).to.equal(
            createdVendor[1]._id.toString()
        )
    })

    it('Fail: given wrong id', async () => {
        const foundVendor = await VendorsModule.getVendorById(null)
        expect(foundVendor[0]).to.equal(404)
        expect(foundVendor[1]).to.deep.equal({ message: 'Vendor not found.' })
    })
})

describe('Module: Update Vendor', () => {
    setup()

    it('Success: update vendor using correct data', async () => {
        const createdVendor = await VendorsModule.createVendor(testdata.vendor1)
        const updatedVendor = await VendorsModule.updateVendor(
            createdVendor[1]._id,
            testdata.vendor2
        )

        expect(updatedVendor[0]).to.equal(200)
        expect(updatedVendor[1].name).to.equal(testdata.vendor2.name)
        expect(updatedVendor[1].email).to.equal(testdata.vendor2.email)
        expect(updatedVendor[1].phone).to.equal(testdata.vendor2.phone)
        expect(updatedVendor[1].address).to.equal(testdata.vendor2.address)
    })

    it('Fail: update vendor using invalid data', async () => {
        const createdVendor = await VendorsModule.createVendor(testdata.vendor1)
        const updatedVendor = await VendorsModule.updateVendor(
            createdVendor[1]._id,
            {
                name: '',
            }
        )

        expect(updatedVendor[0]).to.equal(400)
        expect(updatedVendor[1].errors.name.message).to.equal(
            'Path `name` is required.'
        )
    })

    it('Fail: update vendor using duplicate name', async () => {
        await VendorsModule.createVendor(testdata.vendor1)
        const createdVendor = await VendorsModule.createVendor(testdata.vendor2)
        const updatedVendor = await VendorsModule.updateVendor(
            createdVendor[1]._id,
            testdata.vendor1
        )

        expect(updatedVendor[0]).to.equal(409)
        expect(updatedVendor[1].message).to.equal('Duplicate found.')
    })
})

describe('Module: Delete Vendor', () => {
    setup()

    it('Success: delete an existing vendor', async () => {
        const createdVendor = await VendorsModule.createVendor(testdata.vendor1)
        const deletedVendor = await VendorsModule.deleteVendorById(
            createdVendor[1]._id
        )
        const getVendor = await VendorsModule.getVendorById(
            createdVendor[1]._id
        )

        expect(deletedVendor[0]).to.equal(200)
        expect(getVendor[0]).to.equal(404)
    })

    it('Fail: delete a non-existing vendor', async () => {
        const deletedVendor = await VendorsModule.deleteVendorById(
            'non-existing-id'
        )

        expect(deletedVendor[0]).to.equal(404)
        expect(deletedVendor[1].message).to.equal('Not found.')
    })
})
