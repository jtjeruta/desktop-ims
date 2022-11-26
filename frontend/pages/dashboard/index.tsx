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
            title: 'Total Sales',
            total: StatContext.totalProductSales ?? 0,
            loading: 'get-total-product-sales',
            icon: FaShoppingCart,
            iconClass: 'text-indigo-700',
        },
        {
            title: 'Total Purchases',
            total: StatContext.totalProductPurchases ?? 0,
            loading: 'get-total-product-purchases',
            icon: FaStore,
            iconClass: 'text-red-700',
        },
        {
            title: 'Ave. Sales Order ',
            total: StatContext.averageSales ?? 0,
            loading: 'get-average-sales',
            icon: FaSitemap,
            iconClass: 'text-yellow-600',
        },
        {
            title: 'Ave. Purchase Order',
            total: StatContext.averagePurchases ?? 0,
            loading: 'get-average-purchases',
            icon: FaUsers,
            iconClass: 'text-green-700',
        },
    ]

    useEffect(() => {
        StatContext.listTopProductSales()
        StatContext.listTopProductPurchases()
        StatContext.getTotalProductSales()
        StatContext.getTotalProductPurchases()
        StatContext.getAverageSales()
        StatContext.getAveragePurchases()
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
