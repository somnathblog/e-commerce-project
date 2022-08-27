const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const ProductCartSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: 'Product'
    },
    name: String,
    count: {
        type: Number,
        default: 1
    },
    price: Number,
    seller: {
        type: ObjectId,
        ref: 'User'
    }
})

const OrderSchema = new mongoose.Schema({
    products: [{
        product: {
            type: ObjectId,
            ref: 'Product'
        },
        name: String,
        count: {
            type: Number,
            default: 1
        },
        price: Number,
        seller: {
            type: ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            default: "Received"
        }
    }],
    transaction_id: String,
    amount: Number,
    address: {},
    updated: Date,
    user: {
        type: ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        default: 'Received',
        enum: ["Cancelled","Delivered","Shipped","Processing","Received","Out For Delivery"]
    },
    method:{
        type: String,
        default: 'COD',
        enum: ["COD","DEBIT"]
    }
},{timestamps: true})

const ProductCart = mongoose.model('ProductCart',ProductCartSchema)
const Order = mongoose.model('Order',OrderSchema)

module.exports = {ProductCart,Order}