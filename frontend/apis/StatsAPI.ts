import Axios from './AxiosAPI'
import { ProductSale } from '../contexts/StatsContext/types'

export const listTopProductSales = () =>
    Axios()
        .get('/api/v1/stats/top-product-sales')
        .then((response): [true, ProductSale[]] => [
            true,
            response.data.products,
        ])
        .catch((err): [false, string] => [false, err.response?.message])
