module.exports.getRandomSubset = (arr, size) => {
    if (!Array.isArray(arr) || arr.length <= 0) {
        return []
    }

    const arraySize = arr.length

    if (!size) {
        size = Math.floor(Math.random() * arraySize)
    }

    const subsetSize = Math.min(Math.max(size, 1), arraySize)
    const shuffledArray = arr.sort(() => 0.5 - Math.random())
    const randomSubset = shuffledArray.slice(0, subsetSize)

    return randomSubset
}

module.exports.getRandomElement = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
}
