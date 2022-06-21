import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuthContext } from '../contexts/AuthContext/AuthContext'

const Home = () => {
    const AuthContext = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        if (!AuthContext.user) {
            router.replace('/login')
        } else if (AuthContext.user.role === 'employee') {
            router.replace('/login')
        } else {
            router.replace('/users')
        }
    }, [AuthContext.user, router])

    return <></>
}

export default Home
