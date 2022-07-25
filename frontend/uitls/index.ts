export const compare = (a?: string | number, b?: string | number) => {
    if (typeof a === 'string' || typeof b === 'string') {
        return `${a}`.localeCompare(`${b}`)
    } else if (typeof a === 'number' && typeof b === 'number') {
        return a - b
    } else {
        return 0
    }
}
