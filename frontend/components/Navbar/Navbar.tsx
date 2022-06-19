import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'

type LinkType = {
    text: string
    active: boolean
    roles: ('admin' | 'employee')[]
    onClick?: () => void
}

const Navbar = () => {
    const router = useRouter()
    const links: LinkType[] = [
        {
            text: 'Vendors',
            active: router.asPath === '/vendors',
            roles: ['admin'],
            onClick: () => router.push('/vendors'),
        },
        {
            text: 'Purchase Orders',
            active: router.asPath === '/purchase-orders',
            roles: ['admin'],
            onClick: () => router.push('/purchase-orders'),
        },
        {
            text: 'Inventory',
            active: router.asPath === '/inventory',
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
        {
            text: 'Logout',
            active: false,
            roles: ['admin', 'employee'],
        },
    ]

    return (
        <nav className="bg-neutral-700 flex">
            <div className="container flex flex-wrap justify-between items-center mx-auto">
                <div className="inline-block py-3 px-4 font-semibold text-white">
                    <Link href="/">Inventory Management System</Link>
                </div>
                <div className="hidden w-full md:block md:w-auto">
                    <ul className="flex place-content-center">
                        {links.map((link) => (
                            <li key={link.text} onClick={link.onClick}>
                                <div
                                    className={clsx([
                                        'inline-block py-3 px-4 font-semibold cursor-pointer',
                                        link.active
                                            ? 'bg-slate-50 border-slate-300 text-black border-l border-t border-r rounded-t'
                                            : 'bg-neutral-700 text-white',
                                    ])}
                                >
                                    {link.text}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar