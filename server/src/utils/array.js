module.exports.getRandomSubset = (arr, size) => {
    if (size === undefined) {
        size = Math.floor(Math.random() * arr.length) + 1
    }
    if (size > arr.length) {
        size = arr.length
    }
    return arr.filter(() => Math.random() < size / arr.length)
}

module.exports.getRandomElement = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
}
