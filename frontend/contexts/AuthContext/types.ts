import { AxiosResponse } from 'axios'

export type User = {
    id: string
    firstName: string
    lastName: string
    role: 'admin' | 'employee'
    email: string
}

export type Login = (
    email: string,
    password: string
) => Promise<[true, { user: User; token: string }] | [false, AxiosResponse]>

export type VerifyToken = () => Promise<void>

export type Context = {
    user: User | null
    login: Login
    verifyToken: VerifyToken
}
