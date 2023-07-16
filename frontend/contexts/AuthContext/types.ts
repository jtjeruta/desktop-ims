import { AxiosResponse } from 'axios'

export type User = {
    id: string
    username: string
    firstName: string
    lastName: string
    role: 'admin' | 'employee'
    email: string
}

export type SetupSchema = {
    username: string
    firstName: string
    lastName: string
    email: string
    password: string
}

export type Login = (
    email: string,
    password: string
) => Promise<[true, { user: User; token: string }] | [false, AxiosResponse]>

export type VerifyToken = () => Promise<void>

export type Logout = () => void

export type SetUser = (user: User) => void
export type Setup = (
    setupSchema: SetupSchema
) => Promise<[true, { user: User; token: string }] | [false, AxiosResponse]>
export type ForgotPassword = (
    email: string,
    code: string
) => Promise<[true, { user: User; token: string }] | [false, AxiosResponse]>

export type Context = {
    user: User | null
    login: Login
    verifyToken: VerifyToken
    logout: Logout
    setUser: SetUser
    setup: Setup
    forgotPassword: ForgotPassword
}
