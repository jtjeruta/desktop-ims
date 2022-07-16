import clsx from 'clsx'
import { FC } from 'react'
import { useProductContext } from '../../contexts/ProductContext/ProductContext'
import { getProductMarkup } from '../../uitls/product-utils'
import Card from '../Card/Card'

const ProductDetailsCard: FC = () => {
    const ProductContext = useProductContext()

    const details = {
        SKU: <code>{ProductContext.product?.sku}</code>,
        'Ave. Unit Cost': ProductContext.product?.aveUnitCost ?? 'N/A',
        Markup: getProductMarkup(ProductContext.product) ?? 'N/A',
        'Total items in Store': ProductContext.product?.storeQty,
        'Total items in Warehouse': ProductContext.product?.warehouses.reduce(
            (acc, warehouse) => acc + warehouse.quantity,
            0
        ),
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
                                    <span>
                                        {ProductContext.product ? (
                                            value
                                        ) : (
                                            <div className="h-6 w-28 bg-slate-200 rounded" />
                                        )}
                                    </span>
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
