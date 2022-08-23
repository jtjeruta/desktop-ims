import { useEffect } from 'react'
import clsx from 'clsx'
import { FormProvider, useForm } from 'react-hook-form'
import { useVendorContext } from '../../contexts/VendorContext/VendorContext'
import Select from '../Select/Select'

const VendorSelect = () => {
    const methods = useForm()
    const VendorContext = useVendorContext()

    const details = {
        name: VendorContext.selectedVendor?.name ?? '',
        phone: VendorContext.selectedVendor?.phone ?? '',
        email: VendorContext.selectedVendor?.email ?? '',
        address: VendorContext.selectedVendor?.address ?? '',
    }

    useEffect(() => {
        methods.setValue('vendor', VendorContext.selectedVendor?.id)
    }, [VendorContext.selectedVendor, methods])

    // set on change
    useEffect(() => {
        const subscription = methods.watch(async (data) => {
            const vendor = VendorContext.vendors?.find(
                (vendor) => vendor.id === data.vendor
            )
            vendor && VendorContext.setSelectedVendor(vendor)
        })
        return () => subscription.unsubscribe()
    }, [methods, VendorContext])

    return (
        <div className="w-72">
            <FormProvider {...methods}>
                <form>
                    <Select
                        label=""
                        name="vendor"
                        options={(VendorContext.vendors || []).map(
                            (vendor) => ({
                                value: vendor.id,
                                text: vendor.name,
                            })
                        )}
                    />
                </form>
            </FormProvider>
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
                                <div className="flex">
                                    <span className="w-20 lowercase">
                                        {key}:
                                    </span>
                                    <span className=" text-gray-500">
                                        {value}
                                    </span>
                                </div>
                            </li>
                        )
                    }
                )}
            </ul>
        </div>
    )
}

export default VendorSelect
