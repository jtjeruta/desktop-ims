import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AppContextProvider } from '../contexts/AppContext/AppContext'

function AppContent({ Component, pageProps }: AppProps) {
    return (
        <>
            <Component {...pageProps} />
        </>
    )
}

function App(props: AppProps) {
    return (
        <AppContextProvider>
            <AppContent {...props} />
        </AppContextProvider>
    )
}

export default App
