export const compare = (
    a: string | number | null = '',
    b: string | number | null = ''
) => {
    if (a === null || b === null) return 0
    return typeof a === 'string' || typeof b === 'string'
        ? `${a}`.localeCompare(`${b}`)
        : a - b
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
