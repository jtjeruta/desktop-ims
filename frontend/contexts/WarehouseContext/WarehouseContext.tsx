import React, { useMemo, useState } from 'react'
import * as WarehousesAPI from '../../apis/WarehouseAPI'
import { useAppContext } from '../AppContext/AppContext'
import * as Types from './types'

const WarehouseContext = React.createContext<Types.Context | any>({})

const WarehouseContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const AppContext = useAppContext()
    const [warehouses, setWarehouses] = useState<Types.Warehouse[] | null>(null)
    const [selectedWarehouse, setSelectedWarehouse] =
        useState<Types.Warehouse | null>(null)

    const createWarehouse: Types.CreateWarehouse = async (warehouseDoc) => {
        const key = 'add-warehouse'

        AppContext.addLoading(key)
        const response = await WarehousesAPI.createWarehouse(warehouseDoc)
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return [false, response[1].data]
        }

        setWarehouses((prev) => [...(prev || []), response[1]])
        return [true, response[1]]
    }

    const updateWarehouse: Types.UpdateWarehouse = async (
        warehouseId,
        warehouseDoc
    ) => {
        const key = 'edit-warehouse'

        AppContext.addLoading(key)
        const response = await WarehousesAPI.updateWarehouse(
            warehouseId,
            warehouseDoc
        )
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return [false, response[1].data]
        }

        setWarehouses(
            (prev) =>
                prev?.map((warehouse) => {
                    if (warehouseId !== warehouse.id) return warehouse
                    return response[1]
                }) ?? []
        )

        return [true, response[1]]
    }

    const listWarehouses: Types.ListWarehouses = async () => {
        const key = 'list-warehouses'

        AppContext.addLoading(key)
        const response = await WarehousesAPI.listWarehouses()
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return response
        }

        setWarehouses(response[1])
        return response
    }

    const value: Types.Context = useMemo(
        () => ({
            createWarehouse,
            listWarehouses,
            selectedWarehouse,
            setSelectedWarehouse,
            setWarehouses,
            updateWarehouse,
            warehouses,
        }),
        [warehouses, selectedWarehouse]
    )

    return (
        <WarehouseContext.Provider value={value}>
            {children}
        </WarehouseContext.Provider>
    )
}

const useWarehouseContext = () =>
    React.useContext<Types.Context>(WarehouseContext)

export { WarehouseContext, WarehouseContextProvider, useWarehouseContext }
