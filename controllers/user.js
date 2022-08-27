const User = require('../models/user')
const formidable = require('formidable')
const fs = require('fs')
const _ = require('lodash')

exports.getUserById = (req,res,next,id) => {
    User.findById(id)
    .populate('address')
    .populate('purchases')
    .populate('products')
    .exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({error: "Faild to fetch user.",message: err})
        }
        req.profile = user
        next()
    })
}
exports.getCustomerById = (req,res,next,id) => {
    User.findById(id).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({error: "Faild to fetch user.",message: err})
        }
        req.customer = user
        next()
    })
}

exports.getUserInfo = (req,res) => {
    req.profile.photo = undefined
    return res.json(req.profile)
}

exports.getUserImage = (req,res) => {
    if(req.profile.photo.data){
        res.set('Content-Type',req.profile.photo.contentType)
        return res.send(req.profile.photo.data)
    }
}

exports.editPersonalInfo = (req,res) => {
    const form = formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({error: 'Problem with image.',message: err})
        }
        const {name,email} = fields

        let user = req.profile
        user = _.extend(user,fields)

        if(file.photo){
            if(file.photo.size > 4200000){
                return res.status(400).json({error: 'Max. image limit reached (4MB).'})
            }
            user.photo.data = fs.readFileSync(file.photo.path)
            user.photo.contentType = file.photo.type
        }

        user.save((err,updatedUser)=>{
            if(err){
                return res.status(400).json({error: 'Faild to update info.',message: err})
            }
            return res.json(updatedUser)
        })
    })
}

exports.deleteAccount = (req,res) => {
    let user = req.profile
    user.remove((err,removedUser)=>{
        if(err){
            return res.status(400).json({error: "Faild to close account.",message: err})
        }
        const {name,email} = removedUser
        return res.json({
            name,
            email
        })
    })
}
// Admin Controllers

exports.findAndUpdatelInfo = (req,res) => {
    if(req.customer.role > req.profile.role){
        return res.status(400).json({error: "You don't have authorization to modify this account."})
    }
    const form = formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({error: 'Problem with image.',message: err})
        }
        const {name,email} = fields

        let user = req.customer
        if(req.profile.role < 5){
            if(fields.role){
                if(fields.role > 2){
                    fields.role = undefined
                }
            }
        }
        user = _.extend(user,fields)

        if(file.photo){
            if(file.photo.size > 4200000){
                return res.status(400).json({error: 'Max. image limit reached (4MB).'})
            }
            user.photo.data = fs.readFileSync(file.photo.path)
            user.photo.contentType = file.photo.type
        }

        user.save((err,updatedUser)=>{
            if(err){
                return res.status(400).json({error: 'Faild to update info.',message: err})
            }
            return res.json({success: "Info updated."})
        })
    })
}

exports.findAndDeleteAccount = (req,res) => {

    User.findById(req.body._id).exec((err,user)=>{
        if(err){
            return res.status(400).json({error: "Faild to get account.",message: err})
        }
        if(user.role > req.profile.role){
            return res.status(400).json({error: "You don't have authorization to modify this account."})
        }
        User.findByIdAndRemove(req.body._id).exec((err,removedUser)=>{
        if(err || !removedUser){
            return res.status(400).json({error: "Faild to close account.",message: err})
        }
        const {name,email} = removedUser
        return res.json({
            name,
            email,
            success: "Account Deleted."
            })
        })
    })
}

exports.getAllUsers = (req,res) => {
    User.find().select("-photo").populate('address').exec((err,users)=>{
        if(err || !users){
            return res.status(400).json({error: "No users found or an error occured.",message: err})
        }
        return res.json(users)
    })
}

exports.getSingleUser = (req,res) => {
    User.findById(req.body.id).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({error: "Faild to fetch user.",message: err})
        }
        return res.json(user)
    })
}

exports.searchUser = (req,res) => {
    let method = req.body.searchBy ? req.body.searchBy : 'email'
    let query = req.body.searchQuery

    if(query === ''){
        return res.status(404).json({error: "Enter a value."})
    }

    if(method == "email"){
        User.find({email: {'$regex' : query , '$options' : 'i'}}).populate('address').select('-photo').exec((err,user)=>{
            if(err){
                return res.status(404).json({error: "Search Faild.",message: err})
            }
            return res.json(user)
        })
    }else if(method == 'name'){
        User.find({name: {'$regex' : query , '$options' : 'i'}}).populate('address').select('-photo').exec((err,user)=>{
            if(err){
                return res.status(404).json({error: "Search Faild.",message: err})
            }
            return res.json(user)
        })
    }

}

exports.pushOrderInPurchases = (req,res) => {
    User.findByIdAndUpdate(req.profile._id,
        {$push: {"purchases": req.body.orderId}},
        {safe: true,upsert:true,new:true},
            (err,user)=>{
                if(err || !user){
                    return res.status(400).json("Faild to push order into purchases.")
                }
                return res.json(user)
            }
        )
}

exports.pushOrderInSells = (userId,productId) => {
    User.findByIdAndUpdate(userId,
        {$push: {"products": productId}},
        {safe: true,upsert:true,new:true},
            (err,user)=>{
                if(err || !user){
                    return {output: "Faild to add product to your products."}
                }
                return {output: "Product added to your products."}
            }
        )
}
exports.popOrderFromSells = (userId,productId) => {
    User.findByIdAndUpdate(userId,
        {$pop: {"products": productId}},
        {safe: true,upsert:true,new:true},
            (err,user)=>{
                if(err || !user){
                    return {output: "Faild to remove product from your products."}
                }
                return {output: "Product removed from your products."}
            }
        )
}