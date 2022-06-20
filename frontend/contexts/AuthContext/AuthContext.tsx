import React, { useMemo, useState } from 'react'
import * as AuthAPI from '../../apis/AuthAPI'
import Cookies from 'js-cookie'
import { useAppContext } from '../AppContext/AppContext'
import { Context, User, Login, VerifyToken } from './types'
import { COOKIES } from '../../constants'

const AuthContext = React.createContext<Context | any>({})

const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const AppContext = useAppContext()
    const [user, setUser] = useState<User | null>(null)

    const login: Login = async (email, password) => {
        const key = 'auth-login'
        AppContext.addLoading(key)
        const resp = await AuthAPI.login(email, password)
        AppContext.removeLoading(key)

        if (!resp[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
        } else {
            Cookies.set(COOKIES.SERVER_TOKEN, resp[1].token)
            setUser(resp[1].user)
        }

        return resp
    }

    const verifyToken: VerifyToken = async () => {
        const key = 'auth-verify-token'
        AppContext.addLoading(key)
        const resp = await AuthAPI.verifyToken(
            Cookies.get(COOKIES.SERVER_TOKEN) || ''
        )

        AppContext.removeLoading(key)

        if (resp[0] && (!user || user.id !== resp[1].id)) {
            setUser(resp[1])
        }
    }

    const value: Context = useMemo(
        () => ({
            user,
            login,
            verifyToken,
        }),
        [user]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuthContext = () => React.useContext<Context>(AuthContext)

export { AuthContext, AuthContextProvider, useAuthContext }
