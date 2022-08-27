const ServerTheme = require('../models/serverTheme')

exports.getThemeById = (req,res,next,id) => {
    ServerTheme.findById(id).exec((err,theme)=>{
        if(err){
            return res.status(400).json({error: "Faild to load theme.",message: err})
        }
        req.theme = theme
        next()
    })
}

exports.getCurrentTheme = (req,res) => {
    if(req.theme){
        return res.json(req.theme)
    }
}

exports.createTheme = (req,res) => {
    const theme = new ServerTheme(req.body)
    theme.save((err,savedTheme)=>{
        if(err){
            return res.status(400).json({error: "Faild to create theme.",message: err})
        }
        return res.json(savedTheme)
    })
}

exports.changeTheme = (req,res) => {
    const theme = req.theme
    theme.name = req.body.name
    theme.save((err,changedTheme)=>{
        if(err){
            return res.status(400).json({error: "Faild to change theme.",message: err})
        }
        return res.json(changedTheme)
    })
}

exports.clearTheme = (req,res) => {
    const theme = req.theme
    theme.remove((err,removedTheme)=>{
        if(err){
            return res.status(400).json({error: "Faild to remove theme.",message: err})
        }
        return res.json(removedTheme)
    })
}

exports.getAllTheme = (req,res) => {
    ServerTheme.find().exec((err,themes)=>{
        if(err){
            return res.json({error: "Faild to load themes.",message: err})
        }
        return res.json(themes)
    })
}