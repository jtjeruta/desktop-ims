import React, { FC, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import Card from '../Card/Card'
import { Product } from '../../pages/inventory'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import TextField from '../TextField/TextField'
import Button from '../Button/Button'

type Props = {
    product: Product
}

const AddEditProductForm: FC<Props> = (props) => {
    const methods = useForm()
    const { isLoading } = useAppContext()

    useEffect(() => {
        methods.setValue('name', props.product.name)
        methods.setValue('brand', props.product.brand)
        methods.setValue('category', props.product.category)
        methods.setValue('subCategory', props.product.subCategory)
    }, [props.product, methods])

    return (
        <Card cardClsx="grow basis-0" title="Product Details">
            {isLoading('get-product') || !props.product ? (
                <h1>Loading</h1>
            ) : (
                <FormProvider {...methods}>
                    <form>
                        <div className="grid gap-6 mb-6 lg:grid-cols-2">
                            <TextField
                                name="name"
                                label="Name"
                                placeholder="Product 1"
                                required
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
                            <Button>Update</Button>
                        </div>
                    </form>
                </FormProvider>
            )}
        </Card>
    )
}

export default AddEditProductForm
