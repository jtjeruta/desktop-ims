import clsx from 'clsx'
import React from 'react'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { useAuthContext } from '../../contexts/AuthContext/AuthContext'

const Backdrop = () => {
    const AppContext = useAppContext()
    const AuthContext = useAuthContext()

    return (
        <div
            className={clsx([
                'absolute inset-0 z-10 bg-black bg-opacity-50 transition-all duration-700',
                AuthContext.user?.role === 'admin'
                    ? AppContext.sidebarOpen
                        ? 'opacity-100 md:opacity-0 md:pointer-events-none'
                        : 'opacity-0 pointer-events-none'
                    : 'opacity-0 pointer-events-none',
            ])}
            onClick={() => AppContext.setSidebarOpen(false)}
        />
    )
}

export default Backdrop
