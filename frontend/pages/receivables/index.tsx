import { useLayoutEffect, useState } from 'react'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import Table from '../../components/Table/Table'
import UserLayout from '../../components/UserLayout/UserLayout'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import {
    ReceivableContextProvider,
    useReceivableContext,
} from '../../contexts/ReceivableContext/ReceivableContext'
import { Receivable } from '../../contexts/ReceivableContext/types'
import { escapeRegExp, formatCurrency } from '../../utils'
import AddEditReceivableDialog from '../../components/AddEditReceivableDialog/AddEditReceivableDialog'
import SearchBar from '../../components/SearchBar/SearchBar'
import { formatDate } from '../../utils/date-utils'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import { useRouter } from 'next/router'
import { ActionButton } from '../../components/ActionButton/ActionButton'

const ReceivablesPageContent = () => {
    const AppContext = useAppContext()
    const ReceivableContext = useReceivableContext()
    const [search, setSearch] = useState<string>('')
    const [page, setPage] = useState<number>(0)
    const router = useRouter()

    const filteredReceivables = (ReceivableContext.receivables || []).filter(
        (receivable) => {
            const regex = new RegExp(escapeRegExp(search), 'igm')
            return [
                receivable.name,
                receivable.description,
                `${receivable.amount}`,
            ].some((item) => regex.test(`${item}`))
        }
    )

    const handleOpenReceivableDialog =
        (receivable: Receivable | null) => () => {
            ReceivableContext.setSelectedReceivable(receivable)
            AppContext.openDialog('add-edit-receivable-dialog')
        }

    useLayoutEffect(() => {
        async function init() {
            const responses = await Promise.all([
                ReceivableContext.listReceivables(),
            ])
            if (responses.some((response) => !response[0]))
                return router.push('/500')
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
                    onClick={handleOpenReceivableDialog(null)}
                    className="hidden md:block"
                >
                    Add Receivables
                </Button>
            </div>

            <Card bodyClsx="!px-0 !py-0 overflow-x-auto">
                <Table
                    page={page}
                    handlePageChange={(newPage) => setPage(newPage)}
                    rows={filteredReceivables}
                    loading={AppContext.isLoading('list-receivables')}
                    columns={[
                        {
                            title: 'Date',
                            format: (row) => {
                                const receivable = row as Receivable
                                return formatDate(receivable.date, true)
                            },
                            sort: (receivable) => receivable.date,
                            bodyClsx: 'align-top',
                        },
                        {
                            title: 'Name',
                            format: (row) => {
                                const receivable = row as Receivable
                                return (
                                    <div
                                        className="hover:text-teal-600 cursor-pointer"
                                        onClick={handleOpenReceivableDialog(
                                            receivable
                                        )}
                                    >
                                        {receivable.name}
                                    </div>
                                )
                            },
                            sort: (receivable) => receivable.name,
                            bodyClsx: 'align-top',
                        },
                        {
                            title: 'Description',
                            format: (row) => {
                                const receivable = row as Receivable
                                return (
                                    <div className="truncate overflow-x-hidden">
                                        {receivable.description}
                                    </div>
                                )
                            },
                            bodyClsx: 'max-w-xs',
                            sort: (receivable) => receivable.description,
                        },
                        {
                            title: 'Amount',
                            format: (row) => {
                                const receivable = row as Receivable
                                return receivable.amount
                            },
                            bodyClsx: 'max-w-xs',
                            sort: (receivable) =>
                                formatCurrency(receivable.amount),
                        },
                        {
                            title: ' ',
                            bodyClsx: 'w-0 align-top',
                            format: (row) => {
                                const receivable = row as Receivable
                                return (
                                    <div className="flex">
                                        <Button
                                            style="link"
                                            onClick={() => {
                                                ReceivableContext.setSelectedReceivable(
                                                    receivable
                                                )
                                                AppContext.openDialog(
                                                    'add-edit-receivable-dialog'
                                                )
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            style="link"
                                            onClick={() => {
                                                ReceivableContext.setSelectedReceivable(
                                                    receivable
                                                )
                                                AppContext.openDialog(
                                                    'delete-receivable-dialog'
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
            <AddEditReceivableDialog />
            <ConfirmDialog
                dialogKey="delete-receivable-dialog"
                text="Delete receivable?"
                onConfirm={async () => {
                    if (!ReceivableContext.selectedReceivable) return
                    const response = await ReceivableContext.deleteReceivable(
                        ReceivableContext.selectedReceivable.id
                    )
                    AppContext.closeDialog()

                    if (!response[0]) {
                        AppContext.addNotification({
                            title: `Something went wrong. Please try again later.`,
                            type: 'danger',
                        })
                    } else {
                        AppContext.addNotification({
                            title: `Receivable deleted successfully.`,
                            type: 'success',
                        })
                    }
                }}
                loading={AppContext.isLoading('delete-receivable')}
            />
            <ActionButton onClick={handleOpenReceivableDialog(null)} />
        </UserLayout>
    )
}

const ReceivablesPage = () => {
    return (
        <ReceivableContextProvider>
            <ReceivablesPageContent />
        </ReceivableContextProvider>
    )
}

export default ReceivablesPage
