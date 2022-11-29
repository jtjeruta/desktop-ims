export const compare = (a?: string | number, b?: string | number) => {
    if (typeof a === 'string' || typeof b === 'string') {
        return `${a}`.localeCompare(`${b}`)
    } else if (typeof a === 'number' && typeof b === 'number') {
        return a - b
    } else {
        return 0
    }
}

export const formatCurrency = (amount: number, currency = 'PHP') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount)
}

export const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
