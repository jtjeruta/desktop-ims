import { useRouter } from 'next/router'
import { useLayoutEffect } from 'react'
import { useAuthContext } from '../contexts/AuthContext/AuthContext'

const Home = () => {
    const AuthContext = useAuthContext()
    const router = useRouter()

    useLayoutEffect(() => {
        if (!AuthContext.user) {
            router.replace('/login')
        } else if (AuthContext.user.role === 'employee') {
            router.replace('/login')
        } else {
            router.replace('/reporting')
        }
    }, [AuthContext.user, router])

    return <></>
}

export default Home
