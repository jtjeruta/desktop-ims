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
import { healthCheck, needsSetup } from '../apis/AuthAPI'

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
            const foundRoute = routes.find(
                (route) => route.pathname === router.pathname
            )

            await waitForHealthCheck()
            AppContext.removeLoading('health-check')

            const needsSetupRes = await needsSetup()
            if (!needsSetupRes[0]) return router.push('/500')
            if (needsSetupRes[1]) return router.push('/setup')

            const verifyRes = await AuthContext.verifyToken()
            if (!verifyRes[0]) {
                return router.push('/login')
            } else if (!foundRoute) {
                return router.push('/404')
            } else if (
                verifyRes[1].role === 'employee' &&
                !['everyone', 'employee', 'authenticated'].includes(
                    foundRoute.access
                )
            ) {
                return router.push('/sales-orders')
            } else if (
                verifyRes[1].role === 'admin' &&
                !['everyone', 'admin', 'authenticated'].includes(
                    foundRoute.access
                )
            ) {
                return router.push('/reporting')
            }
        }

        init()
    }, [])

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
