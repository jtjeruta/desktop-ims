import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AppContextProvider } from '../contexts/AppContext/AppContext'
import { AuthContextProvider } from '../contexts/AuthContext/AuthContext'
import NotificationsList from '../components/NotificationList/NotificationList'

function AppContent({ Component, pageProps }: AppProps) {
    return (
        <>
            <NotificationsList />
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
