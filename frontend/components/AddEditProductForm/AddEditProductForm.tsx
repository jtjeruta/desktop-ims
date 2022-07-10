import { FC, useEffect } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

import { useAppContext } from '../../contexts/AppContext/AppContext'
import TextField from '../TextField/TextField'
import Button from '../Button/Button'
import { useProductContext } from '../../contexts/ProductContext/ProductContext'
import AddEditProductFormSkeleton from './Skeleton'

type Props = {
    type?: 'create' | 'update'
}

const AddEditProductForm: FC<Props> = (props) => {
    const methods = useForm()
    const AppContext = useAppContext()
    const ProductContext = useProductContext()
    const router = useRouter()

    const isDisabled =
        AppContext.isLoading('get-product') ||
        (props.type === 'update' && !ProductContext.product)

    const onSubmit = async (values: FieldValues) => {
        if (isDisabled) return null

        const doc = {
            name: values.name as string,
            brand: values.brand as string,
            category: values.category as string,
            subCategory: values.subCategory as string,
            price: +values.price,
        }

        const response = await (ProductContext.product
            ? ProductContext.updateProduct(ProductContext.product.id, doc)
            : ProductContext.createProduct(doc))

        if (response[0]) {
            AppContext.closeDialog()
            methods.reset()
            AppContext.addNotification({
                title: !ProductContext.product
                    ? 'Product added!'
                    : 'Product updated!',
            })
            !ProductContext.product &&
                router.push(`/inventory/${response[1].id}`)
        } else if (response[1].errors) {
            const { errors } = response[1]

            ;(Object.keys(errors) as Array<keyof typeof errors>).map((key) => {
                methods.setError(key, {
                    type: 'custom',
                    message: errors[key]?.message,
                })
            })
        } else if (response[1].message) {
            methods.setError('name', {
                type: 'custom',
                message: 'Name already taken',
            })
        }
    }

    useEffect(() => {
        if (!ProductContext.product) return
        methods.setValue('name', ProductContext.product.name)
        methods.setValue('brand', ProductContext.product.brand)
        methods.setValue('category', ProductContext.product.category)
        methods.setValue('subCategory', ProductContext.product.subCategory)
        methods.setValue('price', +ProductContext.product.price)
    }, [ProductContext.product, methods])

    return isDisabled ? (
        <AddEditProductFormSkeleton />
    ) : (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="mb-6">
                    <TextField
                        name="name"
                        label="Name"
                        placeholder="Product 1"
                        required
                    />
                </div>
                <div className="grid gap-6 mb-6 lg:grid-cols-2">
                    <TextField
                        name="price"
                        type="number"
                        label="Price"
                        placeholder="100.00"
                        required
                        min={0}
                    />
                    <TextField
                        name="brand"
                        label="Brand"
                        placeholder="Brand 1"
                        required
                    />
                </div>
                <div className="grid gap-6 mb-6 lg:grid-cols-2">
                    <TextField
                        name="category"
                        label="Category"
                        placeholder="category 1"
                        required
                    />
                    <TextField
                        name="subCategory"
                        label="Sub Category"
                        placeholder="sub category 1"
                        required
                    />
                </div>
                <div className="flex justify-end">
                    <Button
                        loading={
                            AppContext.isLoading('update-product') ||
                            AppContext.isLoading('add-product')
                        }
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </FormProvider>
    )
}

export default AddEditProductForm
