import React, { useMemo, useState } from 'react'
import * as AuthAPI from '../../apis/AuthAPI'
import Cookies from 'js-cookie'
import { useAppContext } from '../AppContext/AppContext'
import {
    Context,
    User,
    Login,
    VerifyToken,
    Logout,
    Setup,
    ForgotPassword,
} from './types'
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
            Cookies.remove(COOKIES.SERVER_TOKEN)
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
        } else {
            Cookies.remove(COOKIES.SERVER_TOKEN)
        }

        return resp
    }

    const setup: Setup = async (attrs) => {
        const key = 'auth-setup'
        AppContext.addLoading(key)
        const resp = await AuthAPI.setup(attrs)
        AppContext.removeLoading(key)

        if (resp[0]) {
            Cookies.set(COOKIES.SERVER_TOKEN, resp[1].token)
            setUser(resp[1].user)
        }

        return resp
    }

    const forgotPassword: ForgotPassword = async (email, code) => {
        const key = 'auth-forgot-password'
        AppContext.addLoading(key)
        const resp = await AuthAPI.forgotPassword(email, code)
        AppContext.removeLoading(key)

        if (resp[0]) {
            Cookies.set(COOKIES.SERVER_TOKEN, resp[1].token)
            setUser(resp[1].user)
        }

        return resp
    }

    const logout: Logout = async () => {
        Cookies.remove(COOKIES.SERVER_TOKEN)
        setUser(null)
    }

    const value: Context = useMemo(
        () => ({
            user,
            login,
            verifyToken,
            logout,
            setUser,
            setup,
            forgotPassword,
        }),
        [user]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuthContext = () => React.useContext<Context>(AuthContext)

export { AuthContext, AuthContextProvider, useAuthContext }
