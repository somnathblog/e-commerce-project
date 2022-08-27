const Contact = require("../models/contact")

exports.getContactById = (req,res,next,id) => {
    Contact.findById(id).exec((err,contact)=>{
        if(err || !contact){
            return res.status(400).json({error: "Faild to fetch contact info.",message: err})
        }
        req.contact = contact
        next()
    })
}

exports.getAllContact = (req,res) => {
    Contact.find().exec((err,contacts)=>{
        if(err || !contacts){
            return res.status(404).json({error: "No contact info found!",message: err})
        }
        return res.json(contacts)
    })
}

exports.getAContact = (req,res) => {
    if(req.contact){
        return res.json(req.contact)
    }
}

exports.recordContact = (req,res) => {
    const {name,email,response} = req.body

    if(!name || !email || !response){
        return res.status(400).json({error: "All fields are required!",message: "MANDATORY FIELDS MISSING!"})
    }

    let contact = new Contact(req.body)

    contact.save((err,savedContact)=>{
        if(err){
            return res.status(400).json({error: "Faild to record your response. Try again !",message: err})
        }
        return res.json({savedContact})
    })
}

exports.updateContact = (req,res) => {
    let contact = req.contact
    contact.status = req.body.status
    contact.save((err,updatedContact)=>{
        if(err){
            return res.status(400).json({error: 'Faild to update contact status.',message: err})
        }
        return res.json(updatedContact)
    })
}

exports.clearContact = (req,res) => {
    let contact = req.contact
    contact.remove((err,removedContact)=>{
        if(err){
            return res.status(400).json({error: 'Faild to delete contact.',message: err})
        }
        return res.json(removedContact)
    })
}