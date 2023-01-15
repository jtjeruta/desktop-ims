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
        price: faker.finance.amount(),
        published: faker.datatype.boolean(),
        sku: faker.datatype.uuid().split('-').pop().toUpperCase(),
        stock: faker.random.numeric(3),
    }))

    const productRes = await Promise.all(products.map(createProduct))

    if (productRes.some((res) => res[0] !== 201)) {
        throw 'Failed to create products'
    }

    const variants = productRes.reduce((acc, product) => {
        const productVariants = Array.from(
            {
                length: faker.random.numeric(),
            },
            () => ({
                name: [faker.random.word(), faker.random.numeric(2)].join(
                    ' - '
                ),
                quantity: faker.random.numeric(2),
                product: product[1]._id,
            })
        )

        return [...acc, ...productVariants]
    }, [])

    const variantsRes = await Promise.all(variants.map(createVariant))

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
