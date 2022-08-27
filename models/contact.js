const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Submitted."
    }
},{timestamps: true})


module.exports = mongoose.model("Contact",contactSchema)