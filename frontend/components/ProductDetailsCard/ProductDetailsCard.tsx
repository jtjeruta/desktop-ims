import clsx from 'clsx'
import { FC } from 'react'
import { Product } from '../../pages/inventory'
import Card from '../Card/Card'

type Props = {
    product: Product
}

const ProductDetailsCard: FC<Props> = (props) => {
    const details = {
        'Qty in Warehouse': props.product.warehouseQty,
        'Qty in Store': props.product.storeQty,
        'Ave. Price': 100,
        Markup: props.product.markup,
    }

    return (
        <Card cardClsx="basis-0 grow" title="Extra Details">
            <ul className="w-full text-gray-900">
                {(Object.keys(details) as Array<keyof typeof details>).map(
                    (key, index) => {
                        const value = details[key]

                        return (
                            <li
                                key={key}
                                className={clsx(
                                    'py-2 border-gray-200 w-full rounded-t-lg text-sm',
                                    index !== Object.keys(details).length - 1 &&
                                        'border-b'
                                )}
                            >
                                <div className="flex justify-between">
                                    <span>{key}:</span>
                                    <span>{value}</span>
                                </div>
                            </li>
                        )
                    }
                )}
            </ul>
        </Card>
    )
}

export default ProductDetailsCard
