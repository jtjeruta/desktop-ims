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
import { healthCheck } from '../apis/AuthAPI'

function AppContent({ Component, pageProps }: AppProps) {
    const AppContext = useAppContext()
    const AuthContext = useAuthContext()
    const router = useRouter()

    async function waitForHealthCheck() {
        while (true) {
            const [success] = await healthCheck()
            if (success) return success
            await new Promise((resolve) => setTimeout(resolve, 1000))
        }
    }

    useLayoutEffect(() => {
        async function init() {
            await waitForHealthCheck()
            AppContext.removeLoading('health-check')
            AuthContext.verifyToken()
        }

        init()
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
