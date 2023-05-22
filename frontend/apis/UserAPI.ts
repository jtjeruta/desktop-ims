import { AxiosResponse } from 'axios'
import { CreateUpdateUserDoc, User } from '../contexts/UserContext/types'
import Axios from './AxiosAPI'

export const listUsers = () =>
    Axios()
        .get('/api/v1/users')
        .then((response): [true, User[]] => [true, response.data.users])
        .catch((err): [false, string] => [false, err.response?.message])

export const createUser = (data: CreateUpdateUserDoc) =>
    Axios()
        .post('/api/v1/users', data)
        .then((response): [true, User] => [true, response.data.user])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const updateUser = (id: string, data: CreateUpdateUserDoc) =>
    Axios()
        .put(`/api/v1/users/${id}`, data)
        .then((response): [true, User] => [true, response.data.user])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const deleteUser = (id: string) =>
    Axios()
        .delete(`/api/v1/users/${id}`)
        .then((): [true] => [true])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const changePassword = (userId: string, password: string) =>
    Axios()
        .put(`/api/v1/users/${userId}/password`, { password })
        .then((): [true] => [true])
        .catch((err): [false, AxiosResponse] => [false, err.response])
