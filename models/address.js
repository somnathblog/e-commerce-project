const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    line1: {
        type: String,
        required: true,
        maxlength: 200
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    landmark:{
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    }
},{timestamps: true})

module.exports = mongoose.model('Address',addressSchema)