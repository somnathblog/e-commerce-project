const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        maxlength: 100,
        required: true
    },
    description:{
        type: String,
        maxlength: 3000,
        required: true
    },
    photos: [{
        data: Buffer,
        contentType: String
    }
    ],
    stock: {
        type: Number,
        required: true
    },
    sold:{
        type: Number,
        default: 0
    },
    price:{
        type: Number,
        required: true
    },
    category:{
        type: ObjectId,
        ref: "Category"
    },
    seller: {
        type: ObjectId,
        ref: "User"
    }
},{timestamps: true})

module.exports = mongoose.model("Product",productSchema)