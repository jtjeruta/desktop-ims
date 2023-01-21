import clsx from 'clsx'
import { useRouter } from 'next/router'
import { IconType } from 'react-icons'
import { RiDashboardLine } from 'react-icons/ri'
import { MdPointOfSale } from 'react-icons/md'
import { FaBoxes, FaStore, FaTags, FaUsers } from 'react-icons/fa'
import { useAppContext } from '../../contexts/AppContext/AppContext'

type PageGroupType = {
    title: string
    pages: PageType[]
}

type PageType = {
    text: string
    active: boolean
    roles: ('admin' | 'employee')[]
    icon?: IconType
    onClick?: () => void
}

const Sidebar = () => {
    const router = useRouter()
    const AppContext = useAppContext()

    const mainPages: PageType[] = [
        {
            text: 'Reporting',
            active: router.asPath === '/reporting',
            roles: ['admin'],
            onClick: () => sideBarRedirect('/reporting'),
            icon: RiDashboardLine,
        },
        {
            text: 'Inventory',
            active: ['/inventory', '/inventory/[productId]'].includes(
                router.pathname
            ),
            roles: ['admin'],
            icon: FaBoxes,
            onClick: () => sideBarRedirect('/inventory'),
        },
        {
            text: 'Sales Orders',
            active: ['/sales-orders', '/sales-orders/[orderId]'].includes(
                router.pathname
            ),
            roles: ['admin', 'employee'],
            icon: MdPointOfSale,
            onClick: () => sideBarRedirect('/sales-orders'),
        },
        {
            text: 'Purchase Orders',
            active: ['/purchase-orders', '/purchase-orders/[orderId]'].includes(
                router.pathname
            ),
            roles: ['admin'],
            icon: FaTags,
            onClick: () => sideBarRedirect('/purchase-orders'),
        },
        {
            text: 'Vendors',
            active: router.asPath === '/vendors',
            roles: ['admin'],
            icon: FaStore,
            onClick: () => sideBarRedirect('/vendors'),
        },
        {
            text: 'Warehouses',
            active: router.asPath === '/warehouses',
            roles: ['admin'],
            icon: FaStore,
            onClick: () => sideBarRedirect('/warehouses'),
        },
    ]

    function sideBarRedirect(path: string) {
        AppContext.setSidebarOpen(false)
        router.push(path)
    }

    const settingsPages: PageType[] = [
        // {
        //     text: 'Logs',
        //     active: router.asPath === '/logs',
        //     roles: ['admin'],
        //     icon: FaListAlt,
        //     onClick: () => sideBarRedirect('/logs'),
        // },
        {
            text: 'Users',
            active: router.asPath === '/users',
            roles: ['admin'],
            icon: FaUsers,
            onClick: () => sideBarRedirect('/users'),
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
                'transition-all border-r border-gray-300',
                AppContext.sidebarOpen ? 'w-64' : 'w-0 md:w-64'
            )}
        >
            <div className="bg-white w-64 p-6 border-r border-gray-300">
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
            </div>
        </div>
    )
}

export default Sidebar
