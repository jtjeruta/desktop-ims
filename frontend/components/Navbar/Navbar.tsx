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
        <nav className="bg-blue-500 shadow">
            <div className="justify-between px-6 md:items-center md:flex">
                <div>
                    <div className="flex items-center justify-between py-3 md:py-5 md:block">
                        <Link href="/">
                            <h2 className="text-2xl font-bold text-white cursor-pointer">
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
                    <Button color="light" onClick={AuthContext.logout}>
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
