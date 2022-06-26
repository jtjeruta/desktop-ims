import { AxiosResponse } from 'axios'
import { CreateUserDoc, User } from '../contexts/UserContext/types'
import Axios from './AxiosAPI'

export const listUsers = () =>
    Axios()
        .get('/api/v1/users')
        .then((response): [true, User[]] => [true, response.data.users])
        .catch((err): [false, string] => [false, err.response.message])

export const addUser = (data: CreateUserDoc) =>
    Axios()
        .post('/api/v1/users', data)
        .then((response): [true, User] => [true, response.data.user])
        .catch((err): [false, AxiosResponse] => [false, err.response])
