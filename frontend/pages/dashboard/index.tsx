import SingleStatCounter, {
    SingleStatCounterType,
} from '../../components/SingleStatCounter/SingleStatCounter'
import UserLayout from '../../components/UserLayout/UserLayout'
import { FaShoppingCart, FaSitemap, FaStore, FaUsers } from 'react-icons/fa'
import TopSalesCard from '../../components/TopSalesCard/TopSalesCard'
import TopPurchasesCard from '../../components/TopPurchasesCard/TopPurchasesCard'
import DateRangePicker from '../../components/DateRangePicker/DateRangePicker'
import {
    StatContextProvider,
    useStatContext,
} from '../../contexts/StatsContext/StatsContext'
import { useEffect } from 'react'

const DashboardContent = () => {
    const StatContext = useStatContext()
    const singleStatCounters: SingleStatCounterType[] = [
        {
            title: 'Item Sales',
            total: 3822,
            rate: 12,
            icon: FaShoppingCart,
            iconClass: 'text-indigo-700',
        },
        {
            title: 'New Orders',
            total: 10331,
            rate: -6,
            icon: FaStore,
            iconClass: 'text-red-700',
        },
        {
            title: 'Total Products',
            total: 1452,
            rate: 72,
            icon: FaSitemap,
            iconClass: 'text-yellow-600',
        },
        {
            title: 'New Customers',
            total: 3990,
            rate: 150,
            icon: FaUsers,
            iconClass: 'text-green-700',
        },
    ]

    useEffect(() => {
        StatContext.listTopProductSales()
        StatContext.listTopProductPurchases()
    }, [StatContext.dateRange])

    return (
        <UserLayout>
            <div className="flex justify-end mb-6">
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
                <div className="flex gap-6 flex-wrap">
                    <span className="grow">
                        <TopSalesCard />
                    </span>
                    <span className="grow">
                        <TopPurchasesCard />
                    </span>
                </div>
            </div>
        </UserLayout>
    )
}

const Dashboard = () => (
    <StatContextProvider>
        <DashboardContent />
    </StatContextProvider>
)

export default Dashboard
