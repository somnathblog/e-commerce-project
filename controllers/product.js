const Product = require('../models/product')
const formidable = require('formidable')
const fs = require('fs')
const _ = require('lodash')
const { pushOrderInSells ,popOrderFromSells} = require('./user')

exports.getProductById = (req,res,next,id) => {
    Product.findById(id)
    .populate('seller','-photo -encryPassword -salt -purchases')
    .populate('category')
    .exec((err,product)=>{
        if(err){
            return res.status(400).json({error: "Faild to fetch product.",message: err})
        }
        // product.photos.map(photo=>{
        //     photo.data = undefined
        // })
        req.product = product
        next()
    })
}

exports.createProduct  = (req,res) => {
    const form = formidable.IncomingForm()
    form.keepExtensions = true
    form.multiples = true
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({error: 'Something went wrong.',message: err})
        }

        const {name,description,stock,price} = fields
        if(!name || !description || !stock || !price){
            return res.status(400).json({error: "Please fill all required fields."})
        }

        let product = new Product(fields)
        // console.log(form);
        // console.log(files);
        // console.log(fields);
        // console.log(product);
        if(files.photos.length === undefined || files.photos.length <= 1){
            if(files.photos.size > 4200000){
                return res.status(400).json({error: 'File too big.Max. 4MB allowed.'})
            }
            product.photos.push({
                data: fs.readFileSync(files.photos.path),
                contentType: files.photos.type
            })
        }else{
            for(var i = 0;i<files.photos.length;i++){
                if(files.photos[i].size > 4200000){
                    return res.status(400).json({error: 'File too big.Max. 4MB allowed.'})
                }
                product.photos.push({
                    data: fs.readFileSync(files.photos[i].path),
                    contentType: files.photos[i].type
                })
            }
        }

        product.save((err,savedProduct)=>{
            if(err){
                return res.status(400).json({error: "Faild to add product.",message: err})
            }
            let productsListOutput = pushOrderInSells(req.profile._id,savedProduct._id)
            return res.json({
                savedProduct,
                productsListOutput
            })
        })
    })
}

exports.getAllProducts  = (req,res) => {
    Product.find()
    .populate('seller','-photo -encryPassword -salt -purchases')
    .populate('category')
    .exec((err,products)=>{
        if(err){
            return res.status(400).json({error: "No Products found.",message: err})
        }
        products.map(prod=>{
            prod.photos.map(photo=>{
                photo.data = undefined
            })
        })
        return res.json(products)
    })
}
exports.getSingleProduct  = (req,res) => {
    if(req.product){
        req.product.photos.data = undefined
        return res.json(req.product)
    }
}

exports.getIndivisualProductPhoto = (req,res) => {
    let id = req.query.photo
    req.product.photos.map(photo=>{
        if(photo._id == id){
            res.set('Content-Type',photo.contentType)
            return res.send(photo.data)
        }
    })
}

exports.updateProduct  = (req,res) => {
    const form = formidable.IncomingForm()
    form.keepExtensions = true
    form.multiples = true
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({error: 'Something went wrong.',message: err})
        }

        const {name,description,stock,price} = fields
        let product = req.product
        product = _.extend(product,fields)

        if(files.photos){
            if(files.photos.length === undefined || files.photos.length <= 1 && files.photos.length > 0){
                if(files.photos.size > 4200000){
                    return res.status(400).json({error: 'File too big.Max. 4MB allowed.'})
                }
                product.photos = []
                product.photos.push({
                    data: fs.readFileSync(files.photos.path),
                    contentType: files.photos.type
                })
            }else{
                for(var i = 0;i<files.photos.length;i++){
                    if(files.photos[i].size > 4200000){
                        return res.status(400).json({error: 'File too big.Max. 4MB allowed.'})
                    }
                    product.photos = []
                    product.photos.push({
                        data: fs.readFileSync(files.photos[i].path),
                        contentType: files.photos[i].type
                    })
                }
            }
        }

        product.save((err,savedProduct)=>{
            if(err){
                return res.status(400).json({error: "Faild to add product.",message: err})
            }
            return res.json(savedProduct)
        })
    })
}

exports.deleteProduct  = (req,res) => {
    if(req.product){
        let product = req.product
        let productsListOutput = popOrderFromSells(req.profile._id,req.product._id)
        product.remove((err,removedProduct)=>{
            if(err){
                return res.status(400).json({error: "Faild to remove product.",message:err})
            }
            return res.json({
                name: removedProduct.name,
                productsListOutput
            })
        })
    }
}
exports.getProductPhotos  = (req,res) => {
    if(req.product.photos){
        // req.product.photos.forEach(photo=>{
        //     res.set("Content-Type",photo.contentType)
        //     res.write(photo.data)
        // })
        // res.end()
        return res.json(req.product.photos)
    }
}
exports.searchProduct  = (req,res) => {
    let search = req.query.search ? req.query.search : 'zzzzzz';
    Product.find(
        {name: {"$regex": search,"$options": "i"}}
    ).populate('seller','-photo -encryPassword -salt -purchases')
    .populate('category')
    .exec((err,products)=>{
        if(err){
            return res.status(400).json({error: "Faild to search products.",message: err})
        }
        if(!products || products.length == 0){
            return res.status(404).json({error: "No products found.",message: err})
        }
        products.map(prod=>{
            prod.photos.data=undefined
        })
        return res.json(products)
    })
}

exports.updateStock = (req,res,next) =>{
    let myOperations = req.body.orders.products.map(product=>{
        return {
            updateOne : {
                filter: {_id: product._id},
                update: {$inc: {stock: -product.count,sold: +product.count}}
            }
        }
    })

    Product.bulkWrite(myOperations,(err,products)=>{
        if(err){
            return res.status(400).json({error: 'Faild to update stocks.',message: err})
        }
        next()
    })
}

exports.getProductsByCategory = (req,res) => {
    Product.find({category: req.query.category})
    .populate('category')
    .exec((err,products)=>{
        if(err){
            return res.status(400).json({error: "Faild to search products.",message: err})
        }
        products.map(prod=>{
            prod.photos.data=undefined
        })
        return res.json(products)
    })
}