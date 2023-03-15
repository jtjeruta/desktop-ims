const { faker } = require('@faker-js/faker')
const { dbConnect } = require('../src/lib/db')
const {
    createProduct,
    deleteProducts,
    updateProduct,
} = require('../src/modules/products-module')
const {
    createVariant,
    deleteVariants,
} = require('../src/modules/variants-module')

dbConnect()

async function up() {
    const products = Array.from({ length: 200 }, () => ({
        name: [faker.commerce.productName(), faker.random.numeric(3)].join(
            ' - '
        ),
        company: faker.company.name(),
        category: faker.commerce.product(),
        subCategory: faker.commerce.product(),
        sellingPrice: faker.finance.amount(100, 200),
        costPrice: faker.finance.amount(10, 100),
        published: faker.datatype.boolean(),
        sku: faker.datatype.uuid().split('-').pop().toUpperCase(),
        stock: faker.datatype.number({ min: 1, max: 100 }),
        reorderPoint: faker.datatype.number({ min: 10, max: 100 }),
    }))

    const productRes = await Promise.all(
        products.map((product) => createProduct(product))
    )

    if (productRes.some((res) => res[0] !== 201)) {
        throw 'Failed to create products'
    }

    const variants = productRes.reduce((acc, product) => {
        const defaultVariant = {
            name: 'default',
            quantity: 1,
            product: product[1]._id,
        }

        const numberOfVariants = faker.datatype.number({ min: 1, max: 10 })
        const uniqueQuantities = new Set()
        const productVariants = Array.from({ length: numberOfVariants }, () => {
            let quantity = faker.datatype.number({ min: 2, max: 20 })
            while (uniqueQuantities.has(quantity)) {
                quantity = faker.datatype.number({ min: 2, max: 20 })
            }
            uniqueQuantities.add(quantity)
            return {
                name: `group of ${quantity}`,
                quantity,
                product: product[1]._id,
            }
        })

        return [...acc, defaultVariant, ...productVariants]
    }, [])

    const variantsRes = await Promise.all(
        variants.map((variant) => createVariant(variant))
    )

    if (variantsRes.some((res) => res[0] !== 201)) {
        throw 'Failed to create variants'
    }

    const updateDocs = productRes.reduce((acc, productRes) => {
        const product = productRes[1]
        const productVariants = variantsRes.filter((variantRes) =>
            variantRes[1].product.equals(product._id)
        )
        const updateDoc = {
            product: product._id,
            variants: productVariants.map((variantRes) => variantRes[1]._id),
        }
        return [...acc, updateDoc]
    }, [])

    const updateRes = await Promise.all(
        updateDocs.map((doc) =>
            updateProduct(doc.product, { variants: doc.variants })
        )
    )

    if (updateRes.some((res) => res[0] !== 200)) {
        throw 'Failed to update products'
    }
}

async function down() {
    await deleteProducts()
    await deleteVariants()
}

module.exports = { up, down }
