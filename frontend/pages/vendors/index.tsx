import { useLayoutEffect, useState } from 'react'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import Table from '../../components/Table/Table'
import UserLayout from '../../components/UserLayout/UserLayout'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import {
    VendorContextProvider,
    useVendorContext,
} from '../../contexts/VendorContext/VendorContext'
import { Vendor } from '../../contexts/VendorContext/types'
import AddEditVendorDialog from '../../components/AddEditVendorDialog/AddEditVendorDialog'
import { escapeRegExp } from '../../utils'
import SearchBar from '../../components/SearchBar/SearchBar'
import { useRouter } from 'next/router'
import { ActionButton } from '../../components/ActionButton/ActionButton'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'

const VendorsPageContent = () => {
    const AppContext = useAppContext()
    const VendorContext = useVendorContext()
    const router = useRouter()
    const [search, setSearch] = useState<string>('')
    const [page, setPage] = useState<number>(0)

    const filteredVendors = (VendorContext.vendors || []).filter((vendor) => {
        const regex = new RegExp(escapeRegExp(search), 'igm')
        return [
            vendor.name,
            vendor.email,
            vendor.phone,
            vendor.address,
            vendor.remarks,
        ].some((item) => regex.test(`${item}`))
    })

    const openVendorDialog = (vendor: Vendor | null) => () => {
        VendorContext.setSelectedVendor(vendor)
        AppContext.openDialog('add-edit-vendor-dialog')
    }

    useLayoutEffect(() => {
        async function init() {
            const response = await VendorContext.listVendors()
            if (!response[0]) return router.push('/500')
        }

        init()
    }, [])

    return (
        <UserLayout>
            <div className="flex justify-end mb-4 gap-3">
                <SearchBar
                    onSearch={(search) => {
                        setSearch(search)
                        setPage(0)
                    }}
                    inputClass="!text-base h-full !bg-white"
                />
                <Button
                    onClick={openVendorDialog(null)}
                    className="hidden md:block"
                >
                    Add Vendor
                </Button>
            </div>

            <Card bodyClsx="!px-0 !py-0">
                <Table
                    page={page}
                    handlePageChange={(newPage) => setPage(newPage)}
                    rows={filteredVendors}
                    loading={AppContext.isLoading('list-vendors')}
                    columns={[
                        {
                            title: 'Name',
                            format: (row) => {
                                const vendor = row as Vendor
                                return (
                                    <div
                                        className="hover:text-teal-600 cursor-pointer"
                                        onClick={openVendorDialog(vendor)}
                                    >
                                        {vendor.name}
                                    </div>
                                )
                            },
                            sort: (vendor) => vendor.name,
                        },
                        {
                            title: 'Email',
                            format: (row) => {
                                const vendor = row as Vendor
                                return vendor.email
                            },
                            sort: (vendor) => vendor.email,
                        },
                        {
                            title: 'Phone',
                            format: (row) => {
                                const vendor = row as Vendor
                                return vendor.phone
                            },
                            sort: (vendor) => vendor.phone,
                        },
                        {
                            title: 'Address',
                            format: (row) => {
                                const vendor = row as Vendor
                                return vendor.address
                            },
                            sort: (vendor) => vendor.address,
                        },
                        {
                            title: 'Remarks',
                            format: (row) => {
                                const vendor = row as Vendor
                                return (
                                    <div
                                        className="overflow-hidden truncate max-w-xs"
                                        title={vendor.remarks}
                                    >
                                        {vendor.remarks}
                                    </div>
                                )
                            },
                            sort: (vendor) => vendor.remarks,
                        },
                        {
                            title: ' ',
                            bodyClsx: 'w-0',
                            format: (row) => {
                                const vendor = row as Vendor
                                return (
                                    <div className="flex gap-1">
                                        <Button
                                            style="link"
                                            onClick={openVendorDialog(vendor)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            style="link"
                                            onClick={() => {
                                                VendorContext.setSelectedVendor(
                                                    vendor
                                                )
                                                AppContext.openDialog(
                                                    'remove-vendor-dialog'
                                                )
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                )
                            },
                        },
                    ]}
                />
            </Card>
            <AddEditVendorDialog />
            <ActionButton onClick={openVendorDialog(null)} />

            <ConfirmDialog
                text={`Are you sure you want to delete this vendor?`}
                dialogKey="remove-vendor-dialog"
                onConfirm={async () => {
                    if (!VendorContext.selectedVendor) return

                    const response = await VendorContext.deleteVendor(
                        VendorContext.selectedVendor.id
                    )

                    AppContext.closeDialog()

                    if (!response[0]) {
                        return AppContext.addNotification({
                            title: 'Something went wrong!',
                            type: 'danger',
                        })
                    }

                    AppContext.addNotification({
                        title: 'Vendor deleted',
                        type: 'success',
                    })
                }}
            />
        </UserLayout>
    )
}

const VendorsPage = () => {
    return (
        <VendorContextProvider>
            <VendorsPageContent />
        </VendorContextProvider>
    )
}

export default VendorsPage
