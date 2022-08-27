const Address = require('../models/address')
const _ = require('lodash')

exports.getAddressById = (req,res,next,id) => {
    Address.findById(id).exec((err,address)=>{
        if(err){
            return res.status(400).json({error: "Faild to get address.",message: err})
        }
        req.address = address
        next()
    })
}

exports.createAddress = (req,res) => {
    const {name,contact,pincode,landmark} = req.body
    if(!name || !contact || !pincode || !landmark){
        return res.status(400).json({error: 'Fill all required fields.'})
    }
    let address = new Address(req.body)
    address.save((err,savedAddress)=>{
        if(err){
            return res.status(400).json({error: 'Faild to save address.',message: err})
        }
        return res.json(savedAddress)
    })
}

exports.getAddress = (req,res) => {
    if(req.address){
        return res.json(req.address)
    }
}

exports.updateAddress = (req,res) => {
    // const {name,contact,pincode,landmark} = req.body
    let address = req.address
    console.log(req.address)
    address = _.extend(address,req.body)
    address.save((err,savedAddress)=>{
        if(err){
            return res.status(400).json({error: 'Faild to save address.',message: err})
        }
        return res.json(savedAddress)
    })
}

exports.deleteAddress = (req,res) => {
    let address = req.address
    address.remove((err,removedAddress)=>{
        if(err){
            return res.status(400).json({error: "Faild to remove address.", message: err})
        }
        return res.json(removedAddress.landmark)
    })
}