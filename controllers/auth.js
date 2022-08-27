const User = require('../models/user')
const formidable = require('formidable')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt')

exports.registerUser = (req,res) => {
    const form = formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({error: 'Problem with photo.'})
        }
        const {name,email} = fields
        if(!name || !email){
            return res.status(400).json({error: 'Please provide all required info.'})
        }

        let user = new User(fields)

        if(file.photo){
            if(file.photo.size > 4200000){
                return res.status(400).json({error: 'Image too large.'})
            }
            user.photo.data = fs.readFileSync(file.photo.path)
            user.photo.contentType = file.photo.type
        }

        user.save((err,savedUser)=>{
            if(err){
                return res.status(400).json({error: 'Faild to register. Try Again.',message: err})
            }
            const {_id,name} = savedUser
            return res.json({
                _id,
                name
            })
        })
    })

}

exports.loginUser = (req,res) => {
    const {email,password} = req.body
    if(!email || !password){
        return res.status(400).json({error: 'Fill required fields.'})
    }
    User.findOne({email}).exec((err,user)=>{
        if(err || !user){
            return res.status(404).json({error: 'Email is not registered.'})
        }
        if(!user.authenticate(password)){
            return res.status(400).json({error: 'Incorrect email or password.'})
        }
        const token = jwt.sign({_id: user._id},process.env.SECRET)
        res.cookie("token",token,{expire: new Date()+100})
        const {_id,name,email,role} = user
        return res.json({
            token,
            user:{
                _id,
                name,
                email,
                role
            }
        })
    })
}

exports.logout = (req,res) =>{
    res.clearCookie("token")
    res.json({
        message: "User signout success"
    })
}

// Custom Middlewares and Protected Routes.

exports.isSignedIn = expressJWT({
    secret: process.env.SECRET,
    algorithms: ['SHA256','HS256','RS256','RSA',"sha1"],
    userProperty: "auth"
})
exports.isAuthenticated = (req,res,next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id
    if(!checker){
        return res.status(403).json({error: 'Access Denied.'})
    }
    next()
}
exports.isAdmin = (req,res,next) => {
    if(req.profile.role !== 2){
        return res.status(403).json({error: "You dont have admin rights."})
    }
    next()
}
exports.isSeller = (req,res,next) => {
    if(req.profile.role !== 1){
        return res.status(403).json({error: "You dont have seller rights."})
    }
    next()
}
exports.isDeveloper = (req,res,next) => {
    if(req.profile.role !== 5){
        return res.status(403).json({error: "You dont have developer rights."})
    }
    next()
}