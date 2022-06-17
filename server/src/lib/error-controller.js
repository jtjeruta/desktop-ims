module.exports = (err, req, res) => {
    try {
        if (err.name === 'ValidationError')
            return res.status(400).json({ message: 'Bad request.' })
        if (err.code && err.code == 11000)
            return res.status(409).json({ message: 'Duplicate found.' })
        return res.status(500).json({ message: 'An unknown error occurred.' })
    } catch (err) {
        return res.status(500).json({ message: 'An unknown error occurred.' })
    }
}
