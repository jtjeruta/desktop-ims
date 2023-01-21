import { useEffect, useState } from 'react'
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
import { escapeRegExp } from '../../uitls'
import SearchBar from '../../components/SearchBar/SearchBar'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { FaPlus } from 'react-icons/fa'

const VendorsPageContent = () => {
    const AppContext = useAppContext()
    const VendorContext = useVendorContext()
    const md = useMediaQuery('md')
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

    useEffect(() => {
        async function init() {
            if (VendorContext.vendors === null) {
                await VendorContext.listVendors()
            }
        }

        init()
    }, [VendorContext])

    return (
        <UserLayout>
            <div className="flex justify-end mb-6 gap-3">
                <SearchBar
                    onSearch={(search) => {
                        setSearch(search)
                        setPage(0)
                    }}
                    inputClass="!text-base h-full !bg-white"
                />
                <Button
                    onClick={() => {
                        VendorContext.setSelectedVendor(null)
                        AppContext.openDialog('add-edit-vendor-dialog')
                    }}
                >
                    {md ? 'Add Vendor' : <FaPlus />}
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
                                return vendor.name
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
                                return vendor.remarks
                            },
                            sort: (vendor) => vendor.remarks,
                        },
                        {
                            title: ' ',
                            bodyClsx: 'w-0',
                            format: (row) => {
                                const vendor = row as Vendor
                                return (
                                    <Button
                                        style="link"
                                        onClick={() => {
                                            VendorContext.setSelectedVendor(
                                                vendor
                                            )
                                            AppContext.openDialog(
                                                'add-edit-vendor-dialog'
                                            )
                                        }}
                                    >
                                        Edit
                                    </Button>
                                )
                            },
                        },
                    ]}
                />
            </Card>
            <AddEditVendorDialog />
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
