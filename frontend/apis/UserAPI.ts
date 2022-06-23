import { User } from '../contexts/UserContext/types'
import Axios from './AxiosAPI'

export const listUsers = () =>
    Axios()
        .get('/api/v1/users')
        .then((response): [true, User[]] => [true, response.data.users])
        .catch((err): [false, string] => [false, err.response.message])
