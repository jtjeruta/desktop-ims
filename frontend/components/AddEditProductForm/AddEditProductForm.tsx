import { FC, useEffect } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import clsx from 'clsx'

import { useAppContext } from '../../contexts/AppContext/AppContext'
import TextField from '../TextField/TextField'
import Button from '../Button/Button'
import { useProductContext } from '../../contexts/ProductContext/ProductContext'

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
            company: values.company as string,
            category: values.category as string,
            subCategory: values.subCategory as string,
            price: +values.price,
            stock: +values.stock,
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
        methods.setValue('name', ProductContext.product?.name)
        methods.setValue('company', ProductContext.product?.company)
        methods.setValue('category', ProductContext.product?.category)
        methods.setValue('subCategory', ProductContext.product?.subCategory)
        methods.setValue('price', +(ProductContext.product?.price || 0))
        methods.setValue('stock', +(ProductContext.product?.stock || 0))
    }, [ProductContext.product, methods])

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div
                    className={clsx(
                        'grid gap-3 mb-2',
                        props.type !== 'update' && ' lg:grid-cols-2'
                    )}
                >
                    <TextField
                        name="name"
                        label="Name"
                        placeholder="Product 1"
                        disabled={isDisabled}
                        required
                    />
                    {props.type !== 'update' && (
                        <TextField
                            name="price"
                            type="number"
                            label="Price"
                            placeholder="100.00"
                            required
                            disabled={isDisabled}
                            min={0}
                        />
                    )}
                </div>
                <div className="grid gap-3 mb-2 lg:grid-cols-2">
                    {props.type === 'update' ? (
                        <TextField
                            name="price"
                            type="number"
                            label="Price"
                            placeholder="100.00"
                            min={0}
                            disabled={isDisabled}
                            required
                        />
                    ) : (
                        <TextField
                            name="stock"
                            type="number"
                            label="Store Quantity"
                            placeholder="100"
                            min={0}
                            disabled={isDisabled}
                            required
                        />
                    )}
                    <TextField
                        name="company"
                        label="Company"
                        placeholder="Company 1"
                        disabled={isDisabled}
                    />
                </div>
                <div className="grid gap-3 mb-2 lg:grid-cols-2">
                    <TextField
                        name="category"
                        label="Category"
                        placeholder="category 1"
                        disabled={isDisabled}
                    />
                    <TextField
                        name="subCategory"
                        label="Sub Category"
                        placeholder="sub category 1"
                        disabled={isDisabled}
                    />
                </div>
                <div className="flex justify-end">
                    <Button
                        disabled={isDisabled}
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
