import { FC } from 'react'
import Link from 'next/link'
import { FiLogOut } from 'react-icons/fi'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { useAuthContext } from '../../contexts/AuthContext/AuthContext'
import Button from '../Button/Button'
import { FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/router'

type Props = {
    backButton?: boolean
}

const Navbar: FC<Props> = (props) => {
    const router = useRouter()
    const AppContext = useAppContext()
    const AuthContext = useAuthContext()

    return (
        <nav className="bg-white border-b border-gray-300 shadow">
            <div className="justify-between px-2 md:px-6 md:items-center md:flex">
                <div>
                    <div className="flex items-center justify-between py-3 md:py-5 md:block">
                        <div className="flex items-center gap-3">
                            {props.backButton && (
                                <Button onClick={() => router.back()}>
                                    <FaArrowLeft />
                                </Button>
                            )}
                            <Link href="/">
                                <h2 className="text-lg font-bold cursor-pointer">
                                    <span className='hidden md:block'>INVENTORY SYSTEM</span>
                                    <span className='md:hidden'>IMS</span>
                                </h2>
                            </Link>
                        </div>
                        <div className="md:hidden">
                            <Button
                                onClick={() => {
                                    if (AuthContext.user?.role === 'admin') {
                                        AppContext.setSidebarOpen(
                                            (prev) => !prev
                                        )
                                    } else {
                                        AuthContext.logout()
                                    }
                                }}
                            >
                                {AuthContext.user?.role === 'admin' ? (
                                    <GiHamburgerMenu />
                                ) : (
                                    <FiLogOut />
                                )}
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
