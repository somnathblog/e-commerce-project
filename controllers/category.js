const Category = require('../models/category')

exports.getCategoryById = (req,res,next,id) => {
    Category.findById(id).exec((err,category)=>{
        if(err){
            return res.status(400).json({error: 'Faild to get category.',message: err})
        }
        req.category =category
        next()
    })
}

exports.getAllCategories = (req,res) => {
    Category.find().exec((err,cates)=>{
        if(err){
            return res.status(400).json({error: "Faild to get categories.",message: err})
        }
        return res.json(cates)
    })
}
exports.getACategory = (req,res) => {
    if(req.category){
        return res.json(req.category)
    }
}
exports.createCategory = (req,res) => {
    let category = new Category(req.body)
    category.save((err,savedCate)=>{
        if(err){
            if(err.code == 11000){
                return res.status(400).json({error: "Category already exists."})
            }
            return res.status(400).json({error: 'Faild to create category.',message: err})
        }
        return res.json(savedCate)
    })
}
exports.updateCategory = (req,res) => {
    let category = req.category
    category.name = req.body.name
    category.save((err,updatedCate)=>{
        if(err){
            return res.status(400).json({error: 'Faild to update category.',message: err})
        }
        return res.json(updatedCate)
    })
}
exports.deleteCategory = (req,res) => {
    let category = req.category
    category.remove((err,removedCate)=>{
        if(err){
            return res.status(400).json({error: 'Faild to delete category.',message: err})
        }
        return res.json(removedCate)
    })
}