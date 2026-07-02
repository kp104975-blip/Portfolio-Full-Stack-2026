const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },
    headTitle: [
        {
            type: String
        }
    ],
    headDescription: [
        {
            type: String
        }
    ]
}, {timestamps: true})

module.exports = mongoose.model('service', serviceSchema)