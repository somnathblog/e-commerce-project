const {Order} = require('../models/order')

exports.getOrderById = (req,res,next,id) => {
    Order.findById(id)
    .populate('products.product','-photos.data')
    .populate('user','-photo')
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({error: "Faild to get order.",message: err})
        }
        req.order = order
        next()
    })
}

exports.getAOrder = (req,res) => {
    if(req.order){
        return res.json(req.order)
    }
}

exports.getOrders = (req,res) => {
    Order.find().exec((err,orders)=>{
        if(err){
            return res.status(400).json({error: "Faild to load orders.",message: err})
        }
        return res.json(orders)
    })
}

exports.getAllOrderStatus = (req,res) => {
    return res.json(Order.schema.path('status').enumValues)
}

exports.getPlacedOrders = (req,res) => {
    Order.find({seller: req.profile._id}).populate('user','-photo').exec((err,orders)=>{
        if(err){
            return res.status(400).json({error: "Faild to get orders.",message: err})
        }
        return res.json(orders)
    })
}

exports.createOrder = (req,res,next) => {
    console.log("Order 1st")
    const order = new Order(req.body)
    order.save((err,order)=>{
        if(err){
            return res.status(400).json({error: "faild to save order"})
        }
        res.json(order)
        next()
    })
}

exports.sendConfimationMail = (req,res) => {
    console.log("CONFIRMATION MAIL!")
}

exports.updateOrderStatus = (req,res) => {
    Order.updateOne(
        {_id: req.body.orderId},
        {$set: {status: req.body.status}},
        (err,order)=>{
            if(err){
                return res.status(400).json({error: "Cannot update order status"})
            }
            res.json(order)
        }
    )
}
exports.updateOrdersProductStatus = (req,res) => {
    console.log(req);
    let order = req.order
    order.products.map((product)=>{
        if(product._id == req.body.productId){
            product.status = req.body.status
        }
    })
    order.save((err,updatedOrder)=>{
        if(err){
            return res.status(400).json({error: 'Faild to update order.',message: err})
        }
        return res.json(updatedOrder)
    })
}

exports.deleteOrder = (req,res,next) => {
    if(req.order.method === "COD"){
        let order = req.order
        order.remove((err,order)=>{
            if(err){
                return res.status(400).json({error: "Faild to cancel order.",message: err})
            }
            res.json(order)
            next()
        })
    }else{
        return res.json({error: "This feature only available for Cash on Delivery.",info: "If you want to cancel it anyway contact us.",code: "REFUND"})
    }
}

exports.sendCancellationMail = (req,res) =>{}