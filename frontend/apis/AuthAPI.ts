import Axios from './AxiosAPI'
import { User } from '../contexts/AuthContext/types'
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
        .catch((err): [false, string] => [false, err.response.data])
