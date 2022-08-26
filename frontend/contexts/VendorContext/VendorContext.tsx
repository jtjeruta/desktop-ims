import React, { useMemo, useState } from 'react'
import * as VendorsAPI from '../../apis/VendorAPI'
import { useAppContext } from '../AppContext/AppContext'
import * as Types from './types'

const VendorContext = React.createContext<Types.Context | any>({})

const VendorContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const AppContext = useAppContext()
    const [vendors, setVendors] = useState<Types.Vendor[] | null>(null)
    const [selectedVendor, setSelectedVendor] = useState<Types.Vendor | null>(
        null
    )
    const [draftVendor, setDraftVendor] = useState<Types.AddEditVendorDoc>({
        name: '',
        email: '',
        phone: '',
        address: '',
    })

    const createVendor: Types.CreateVendor = async (vendorDoc) => {
        const key = 'add-vendor'

        AppContext.addLoading(key)
        const response = await VendorsAPI.createVendor(vendorDoc)
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return [false, response[1].data]
        }

        setVendors((prev) => [...(prev || []), response[1]])
        return [true, response[1]]
    }

    const updateVendor: Types.UpdateVendor = async (id, vendorDoc) => {
        const key = 'update-vendor'

        AppContext.addLoading(key)
        const response = await VendorsAPI.updateVendor(id, vendorDoc)
        AppContext.removeLoading(key)

        if (!response[0]) {
            return [false, response[1].data]
        }

        // update vendors
        setVendors((prev) =>
            (prev || []).map((vendor) => {
                if (vendor.id !== id) return vendor
                return response[1]
            })
        )

        // update current vendor detials
        if (id === selectedVendor?.id) {
            setSelectedVendor(response[1])
        }

        return [true, response[1]]
    }

    const listVendors: Types.ListVendors = async () => {
        const key = 'list-vendors'

        AppContext.addLoading(key)
        const response = await VendorsAPI.listVendors()
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return response
        }

        setVendors(response[1])
        return response
    }

    const value: Types.Context = useMemo(
        () => ({
            vendors,
            selectedVendor,
            draftVendor,
            setDraftVendor,
            createVendor,
            updateVendor,
            listVendors,
            setSelectedVendor,
        }),
        [vendors, selectedVendor, draftVendor]
    )

    return (
        <VendorContext.Provider value={value}>
            {children}
        </VendorContext.Provider>
    )
}

const useVendorContext = () => React.useContext<Types.Context>(VendorContext)

export { VendorContext, VendorContextProvider, useVendorContext }
