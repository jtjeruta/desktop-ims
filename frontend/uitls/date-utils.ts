import moment from 'moment'

export const formatDate = (date: number) =>
    moment(date * 1000).format('MMM DD, YYYY')
