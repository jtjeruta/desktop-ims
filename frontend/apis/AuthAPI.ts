import Axios from './AxiosAPI'
import { SetupSchema, User } from '../contexts/AuthContext/types'
import { AxiosResponse } from 'axios'

export const login = (email: string, password: string) =>
    Axios()
        .post('/api/v1/auth/login', { email, password })
        .then((response): [true, { user: User; token: string }] => [
            true,
            response.data,
        ])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const verifyToken = (token: string) =>
    Axios()
        .post('/api/v1/auth/verify-token', { token })
        .then((response): [true, User] => [true, response.data.user])
        .catch((err): [false, string] => [false, err.response?.message])

export const healthCheck = () =>
    Axios()
        .get('/api/v1/tasks/health-check')
        .then((): [true] => [true])
        .catch((err): [false, string] => [false, err.response?.message])

export const setup = (setupSchema: SetupSchema) =>
    Axios()
        .post('/api/v1/auth/setup', setupSchema)
        .then((response): [true, { user: User; token: string }] => [
            true,
            response.data,
        ])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const needsSetup = () =>
    Axios()
        .get('/api/v1/auth/needs-setup')
        .then((res): [true, boolean] => [true, res.data.needsSetup])
        .catch((err): [false, string] => [false, err.response?.message])

export const forgotPassword = (email: string, code: string) =>
    Axios()
        .post('/api/v1/auth/forgot-password', { email, code })
        .then((res): [true, { user: User; token: string }] => [true, res.data])
        .catch((err): [false, AxiosResponse] => [false, err.response])
