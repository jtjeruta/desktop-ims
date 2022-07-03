const { default: mongoose } = require('mongoose')

module.exports = {
    createdAt: {
        type: Number,
        required: true,
    },
    modifiedAt: {
        type: Number,
        required: true,
    },
    modifiedBy: {
        type: mongoose.ObjectId,
        required: true,
    },
}
