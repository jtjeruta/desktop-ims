import clsx from 'clsx'
import { FC } from 'react'
import { useProductContext } from '../../contexts/ProductContext/ProductContext'
import { useWarehouseContext } from '../../contexts/WarehouseContext/WarehouseContext'
import { getProductWarehouseTotal } from '../../uitls/product-utils'
import Card from '../Card/Card'

const ProductDetailsCard: FC = () => {
    const ProductContext = useProductContext()
    const WarehouseContext = useWarehouseContext()

    const details = {
        SKU: <code>{ProductContext.product?.sku}</code>,
        'Ave. Unit Cost': ProductContext.product?.aveUnitCost ?? 'N/A',
        'Total items in Store': ProductContext.product?.stock || 0,
        'Total items in Warehouse': getProductWarehouseTotal(
            WarehouseContext.warehouses,
            ProductContext.product
        ),
    }

    return (
        <Card cardClsx="basis-0 grow" title="Details">
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
