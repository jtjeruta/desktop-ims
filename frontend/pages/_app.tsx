import '../styles/globals.css'
import { useLayoutEffect } from 'react'
import { useRouter } from 'next/router'
import type { AppProps } from 'next/app'
import {
    AppContextProvider,
    useAppContext,
} from '../contexts/AppContext/AppContext'
import {
    AuthContextProvider,
    useAuthContext,
} from '../contexts/AuthContext/AuthContext'
import NotificationsList from '../components/NotificationList/NotificationList'
import LoadingScreen from '../components/LoadingScreen/LoadingScreen'
import { routes } from '../routes'

function AppContent({ Component, pageProps }: AppProps) {
    const AppContext = useAppContext()
    const AuthContext = useAuthContext()
    const router = useRouter()

    useLayoutEffect(() => {
        AuthContext.verifyToken()
    }, [])

    useLayoutEffect(() => {
        if (AppContext.isLoading('auth-verify-token')) return

        const foundRoute = routes.find(
            (route) => route.pathname === router.pathname
        )

        if (!foundRoute) return

        if (
            !AuthContext.user &&
            !['everyone', 'un-authenticated'].includes(foundRoute.access)
        ) {
            router.replace('/login')
        } else if (
            AuthContext.user?.role === 'employee' &&
            !['everyone', 'employee', 'authenticated'].includes(
                foundRoute.access
            )
        ) {
            router.replace('/sales-orders')
        } else if (
            AuthContext.user?.role === 'admin' &&
            !['everyone', 'admin', 'authenticated'].includes(foundRoute.access)
        ) {
            router.replace('/reporting')
        }
    }, [AppContext, AuthContext.user, router])

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
