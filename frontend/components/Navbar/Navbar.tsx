import Link from 'next/link'
import { FaHamburger } from 'react-icons/fa'
import { FiLogOut } from 'react-icons/fi'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { useAuthContext } from '../../contexts/AuthContext/AuthContext'
import Button from '../Button/Button'

const Navbar = () => {
    const AppContext = useAppContext()
    const AuthContext = useAuthContext()

    return (
        <nav className="bg-white border-b border-gray-300 shadow">
            <div className="justify-between px-6 md:items-center md:flex">
                <div>
                    <div className="flex items-center justify-between py-3 md:py-5 md:block">
                        <Link href="/">
                            <h2 className="text-lg font-bold cursor-pointer">
                                INVENTORY SYSTEM
                            </h2>
                        </Link>
                        <div className="md:hidden">
                            <Button
                                onClick={() =>
                                    AppContext.setSidebarOpen((prev) => !prev)
                                }
                            >
                                <FaHamburger />
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="hidden md:inline-block">
                    <Button color="secondary" onClick={AuthContext.logout}>
                        <div className="flex items-center gap-2">
                            <FiLogOut fontSize={18} />
                            <span>Logout</span>
                        </div>
                    </Button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
