import PageHeader from '../../components/PageHeader/PageHeader'
import SingleStatCounter, {
    SingleStatCounterType,
} from '../../components/SingleStatCounter/SingleStatCounter'
import UserLayout from '../../components/UserLayout/UserLayout'
import { FaShoppingCart, FaSitemap, FaStore, FaUsers } from 'react-icons/fa'

const Dashboard = () => {
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

    return (
        <UserLayout>
            <PageHeader breadcrumbs={[{ text: 'Dashboard' }]} />
            <div className="flex gap-6 flex-wrap">
                {singleStatCounters.map((stat) => (
                    <SingleStatCounter key={stat.title} {...stat} />
                ))}
            </div>
        </UserLayout>
    )
}

export default Dashboard
