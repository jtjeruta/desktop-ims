import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FaHamburger } from 'react-icons/fa'
import { useAuthContext } from '../../contexts/AuthContext/AuthContext'
import Button from '../Button/Button'

type LinkType = {
    text: string
    active: boolean
    roles: ('admin' | 'employee')[]
    onClick?: () => void
}

const Navbar = () => {
    const AuthContext = useAuthContext()
    const router = useRouter()
    const [openMenu, setOpenMenu] = useState<boolean>(false)
    const links: LinkType[] = [
        {
            text: 'Vendors',
            active: router.asPath === '/vendors',
            roles: ['admin'],
            onClick: () => router.push('/vendors'),
        },
        {
            text: 'Purchase Orders',
            active: ['/purchase-orders', '/purchase-orders/[orderId]'].includes(
                router.pathname
            ),
            roles: ['admin'],
            onClick: () => router.push('/purchase-orders'),
        },
        {
            text: 'Inventory',
            active: ['/inventory', '/inventory/[productId]'].includes(
                router.pathname
            ),
            roles: ['admin'],
            onClick: () => router.push('/inventory'),
        },
        {
            text: 'Sales Orders',
            active: router.asPath === '/sales-orders',
            roles: ['admin', 'employee'],
            onClick: () => router.push('/sales-orders'),
        },
        {
            text: 'Customers',
            active: router.asPath === '/customers',
            roles: ['admin'],
            onClick: () => router.push('/customers'),
        },
        {
            text: 'Logs',
            active: router.asPath === '/logs',
            roles: ['admin'],
            onClick: () => router.push('/logs'),
        },
        {
            text: 'Users',
            active: router.asPath === '/users',
            roles: ['admin'],
            onClick: () => router.push('/users'),
        },
    ]

    return (
        <nav className="bg-blue-500 shadow">
            <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
                <div>
                    <div className="flex items-center justify-between py-3 md:py-5 md:block">
                        <Link href="/">
                            <h2 className="text-2xl font-bold text-white cursor-pointer">
                                INVENTORY SYSTEM
                            </h2>
                        </Link>
                        <div className="md:hidden">
                            <Button
                                onClick={() => setOpenMenu((prev) => !prev)}
                            >
                                <FaHamburger />
                            </Button>
                        </div>
                    </div>
                </div>
                <div className={clsx(!openMenu && 'hidden md:block')}>
                    <div className="flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 block">
                        <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
                            {links.map((link) => (
                                <li
                                    key={link.text}
                                    className={clsx(
                                        'text-white hover:text-indigo-200 cursor-pointer',
                                        link.active && 'font-bold'
                                    )}
                                    onClick={link.onClick}
                                >
                                    {link.text}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-3 md:hidden">
                            <Button
                                className="w-full"
                                color="light"
                                onClick={AuthContext.logout}
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="hidden md:inline-block">
                    <Button color="light" onClick={AuthContext.logout}>
                        Logout
                    </Button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
