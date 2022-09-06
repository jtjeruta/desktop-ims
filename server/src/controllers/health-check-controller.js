module.exports.healthCheck = async (req, res) => {
    return res.status(200).send('OK')
}
