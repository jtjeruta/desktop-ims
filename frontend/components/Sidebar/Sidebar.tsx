import clsx from 'clsx'
import { useRouter } from 'next/router'
import { IconType } from 'react-icons'
import { RiDashboardLine } from 'react-icons/ri'
import { MdPointOfSale } from 'react-icons/md'
import {
    FaBoxes,
    FaQrcode,
    FaStore,
    FaTags,
    FaUsers,
    FaWarehouse,
} from 'react-icons/fa'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { useAuthContext } from '../../contexts/AuthContext/AuthContext'
import { FiLogOut } from 'react-icons/fi'
import Button from '../Button/Button'
import { GiExpense, GiReceiveMoney } from 'react-icons/gi'

type PageGroupType = {
    title: string
    pages: PageType[]
}

type PageType = {
    text: string
    active: boolean
    icon?: IconType
    onClick?: () => void
}

const Sidebar = () => {
    const router = useRouter()
    const AppContext = useAppContext()
    const AuthContext = useAuthContext()

    const mainPages: PageType[] = [
        {
            text: 'Reporting',
            active: router.asPath === '/reporting',
            onClick: () => sideBarRedirect('/reporting'),
            icon: RiDashboardLine,
        },
        {
            text: 'Inventory',
            active: ['/inventory', '/inventory/[productId]'].includes(
                router.pathname
            ),
            icon: FaBoxes,
            onClick: () => sideBarRedirect('/inventory'),
        },
        {
            text: 'Sales Orders',
            active: ['/sales-orders', '/sales-orders/[orderId]'].includes(
                router.pathname
            ),
            icon: MdPointOfSale,
            onClick: () => sideBarRedirect('/sales-orders'),
        },
        {
            text: 'Purchase Orders',
            active: ['/purchase-orders', '/purchase-orders/[orderId]'].includes(
                router.pathname
            ),
            icon: FaTags,
            onClick: () => sideBarRedirect('/purchase-orders'),
        },
        {
            text: 'Vendors',
            active: router.asPath === '/vendors',
            icon: FaStore,
            onClick: () => sideBarRedirect('/vendors'),
        },
        {
            text: 'Warehouses',
            active: router.asPath === '/warehouses',
            icon: FaWarehouse,
            onClick: () => sideBarRedirect('/warehouses'),
        },
        {
            text: 'Expenses',
            active: router.asPath === '/expenses',
            icon: GiExpense,
            onClick: () => sideBarRedirect('/expenses'),
        },
        {
            text: 'Receivables',
            active: router.asPath === '/receivables',
            icon: GiReceiveMoney,
            onClick: () => sideBarRedirect('/receivables'),
        },
    ]

    function sideBarRedirect(path: string) {
        AppContext.setSidebarOpen(false)
        router.push(path)
    }

    const settingsPages: PageType[] = [
        {
            text: 'Users',
            active: router.asPath === '/users',
            icon: FaUsers,
            onClick: () => sideBarRedirect('/users'),
        },
        {
            text: 'Connect',
            active: router.asPath === '/connect',
            icon: FaQrcode,
            onClick: () => sideBarRedirect('/connect'),
        },
    ]

    const pageGroups: PageGroupType[] = [
        {
            title: 'Pages',
            pages: mainPages,
        },
        {
            title: 'Settings',
            pages: settingsPages,
        },
    ]

    return (
        <div
            className={clsx(
                'transition-all border-r border-gray-300 absolute md:static h-full z-10 overflow-x-hidden',
                AuthContext.user?.role === 'admin'
                    ? AppContext.sidebarOpen
                        ? 'w-64'
                        : 'w-0 md:w-64 md:min-w-fit'
                    : 'w-0'
            )}
        >
            <div className="bg-white w-64 p-6 border-r border-gray-300 h-full flex flex-col justify-between">
                <div className="flex flex-col gap-10">
                    {pageGroups.map((pageGroup) => (
                        <div
                            key={pageGroup.title}
                            className="flex flex-col gap-4"
                        >
                            <p className="uppercase text-xs text-gray-600 tracking-wider">
                                {pageGroup.title}
                            </p>
                            {pageGroup.pages.map((page) => (
                                <a
                                    key={page.text}
                                    className={clsx(
                                        'capitalize text-sm cursor-pointer',
                                        'transition ease-in-out duration-200 hover:text-teal-600',
                                        page.active && 'text-teal-600'
                                    )}
                                    onClick={page.onClick}
                                >
                                    <div className="flex items-center gap-2">
                                        {page.icon && <page.icon />}
                                        <span>{page.text}</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ))}
                </div>

                <Button
                    className="md:hidden"
                    color="secondary"
                    onClick={AuthContext.logout}
                >
                    <div className="flex items-center gap-2">
                        <FiLogOut fontSize={18} />
                        <span>Logout</span>
                    </div>
                </Button>
            </div>
        </div>
    )
}

export default Sidebar
