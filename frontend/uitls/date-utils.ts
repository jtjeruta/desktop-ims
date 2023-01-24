import moment from 'moment'

export const formatDate = (date: number, showTime?: boolean) =>
    moment(date * 1000).format(`MMM DD, YYYY ${showTime ? 'hh:mm A' : ''}`)
