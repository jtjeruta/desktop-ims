module.exports.getRandomSubset = (arr, size) => {
    if (size === undefined) {
        size = Math.floor(Math.random() * arr.length)
    }

    return arr.filter(() => Math.random() < (size || 1) / arr.length)
}

module.exports.getRandomElement = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
}
