import { useLayoutEffect, useState } from 'react'
import SingleStatCounter, {
    SingleStatCounterType,
} from '../../components/SingleStatCounter/SingleStatCounter'
import UserLayout from '../../components/UserLayout/UserLayout'
import { FaMoneyBill, FaMoneyBillWave, FaShoppingCart, FaStore } from 'react-icons/fa'
import ReportingTable from '../../components/ReportingTable/ReportingTable'
import DateRangePicker from '../../components/DateRangePicker/DateRangePicker'
import {
    StatContextProvider,
    useStatContext,
} from '../../contexts/StatsContext/StatsContext'
import SearchBar from '../../components/SearchBar/SearchBar'

const ReportingContent = () => {
    const StatContext = useStatContext()
    const [page, setPage] = useState<number>(0)
    const singleStatCounters: SingleStatCounterType[] = [
        {
            title: 'Total Sales',
            total: StatContext.totalProductSales ?? 0,
            loading: 'get-total-product-sales',
            icon: FaShoppingCart,
            iconClass: 'text-indigo-700',
        },
        {
            title: 'Total Cost',
            total: StatContext.totalProductPurchases ?? 0,
            loading: 'get-total-product-purchases',
            icon: FaStore,
            iconClass: 'text-red-700',
        },
        {
            title: 'Total Expenses',
            total: StatContext.totalExpenses ?? 0,
            loading: 'get-total-expenses',
            icon: FaMoneyBill,
            iconClass: 'text-green-700',
        },
        {
            title: 'Total Receivables',
            total: StatContext.totalReceivables ?? 0,
            loading: 'get-total-receivables',
            icon: FaMoneyBillWave,
            iconClass: 'text-red-700',
        },
    ]

    useLayoutEffect(() => {
        StatContext.getTotalProductSales()
        StatContext.getTotalProductPurchases()
        StatContext.listProductReports()
        StatContext.getTotalExpenses()
        StatContext.getTotalReceivables()
    }, [StatContext.dateRange])

    return (
        <UserLayout>
            <div className="flex justify-end mb-6 gap-3">
                <SearchBar
                    onSearch={(searchText) => {
                        StatContext.setSearch(searchText)
                        setPage(0)
                    }}
                    inputClass="!text-base h-full !bg-white"
                />
                <DateRangePicker
                    onChange={(start, end) =>
                        StatContext.setDateRange({
                            startDate: start,
                            endDate: end,
                        })
                    }
                    defaultStartDate={StatContext.dateRange.startDate}
                    defaultEndDate={StatContext.dateRange.endDate}
                />
            </div>
            <div className="flex flex-col gap-6">
                <div className="flex gap-6 flex-wrap">
                    {singleStatCounters.map((stat) => (
                        <SingleStatCounter key={stat.title} {...stat} />
                    ))}
                </div>
                <ReportingTable page={page} setPage={setPage} />
            </div>
        </UserLayout>
    )
}

const Reporting = () => (
    <StatContextProvider>
        <ReportingContent />
    </StatContextProvider>
)

export default Reporting
