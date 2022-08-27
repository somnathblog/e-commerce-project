const mongoose = require('mongoose')
const crypto = require('crypto')
const {ObjectId} = mongoose.Schema.Types
const {v1} = require('uuid')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        maxlength: 50,
        unique: true
    },
    encryPassword: {
        type: String,
        required: true
    },
    salt: String,
    photo: {
        data: Buffer,
        contentType: String
    },
    purchases:[{
        type: ObjectId,
        ref: 'Order'
    }],
    products:[{
        type: ObjectId,
        default: 'Product'
    }],
    role:{
        type: Number,
        default: 0
    },
    address: {
        type: ObjectId,
        ref: 'Address',
        required: true
    }

},{timestamps: true})

userSchema.virtual('password')
    .set(function(password){
        this._password = password
        this.salt = v1()
        this.encryPassword = this.securePassword(password)
    }).get(        
        function(){
        return this._password
    })


userSchema.methods = {
    authenticate: function(password){
        return  this.securePassword(password) === this.encryPassword
    },
    securePassword: function(password){
        if(!password) return ''

        try{
            return crypto.createHmac('sha256',this.salt)
                        .update(password)
                        .digest('hex')
        }catch(e){
            return ''
        }

    }
}

module.exports = mongoose.model('User',userSchema)