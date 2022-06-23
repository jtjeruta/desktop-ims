import axios from 'axios'
import Cookie from 'js-cookie'
import { COOKIES } from '../constants'

const Axios = () =>
    axios.create({
        baseURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4000',
        headers: {
            Authorization: Cookie.get(COOKIES.SERVER_TOKEN) || '',
            'Content-Type': 'application/json',
        },
    })

export default Axios
