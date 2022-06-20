import '../styles/globals.css'
import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import type { AppProps } from 'next/app'
import { AppContextProvider } from '../contexts/AppContext/AppContext'
import {
    AuthContextProvider,
    useAuthContext,
} from '../contexts/AuthContext/AuthContext'
import NotificationsList from '../components/NotificationList/NotificationList'
import LoadingScreen from '../components/LoadingScreen/LoadingScreen'

const noUserPaths = ['/login']
const employeePaths: string[] = []
const adminPaths: string[] = ['/users']

function AppContent({ Component, pageProps }: AppProps) {
    const AuthContext = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        AuthContext.verifyToken()
    }, [AuthContext])

    useEffect(() => {
        if (
            !AuthContext.user &&
            !noUserPaths.includes(router.pathname) &&
            [...employeePaths, ...adminPaths].includes(router.pathname)
        ) {
            router.replace('/login')
        } else if (
            AuthContext.user?.role === 'employee' &&
            !employeePaths.includes(router.pathname) &&
            [...noUserPaths, ...adminPaths].includes(router.pathname)
        ) {
            router.replace('/login')
        } else if (
            AuthContext.user?.role === 'admin' &&
            !adminPaths.includes(router.pathname) &&
            [...noUserPaths, ...employeePaths].includes(router.pathname)
        ) {
            router.replace('/users')
        }
    }, [AuthContext.user, router])

    return (
        <>
            <NotificationsList />
            <LoadingScreen />
            <Component {...pageProps} />
        </>
    )
}

function App(props: AppProps) {
    return (
        <AppContextProvider>
            <AuthContextProvider>
                <AppContent {...props} />
            </AuthContextProvider>
        </AppContextProvider>
    )
}

export default App
