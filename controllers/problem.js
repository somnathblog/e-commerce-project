const Problem = require("../models/problem")

exports.getProblemById = (req,res,next,id) => {
    Problem.findById(id).exec((err,problem)=>{
        if(err || !problem){
            return res.status(400).json({error: "Faild to fetch contact info.",message: err})
        }
        req.problem = problem
        next()
    })
}

exports.getAllProblems = (req,res) => {
    Problem.find().exec((err,problems)=>{
        if(err || !problems){
            return res.status(404).json({error: "No contact info found!",message: err})
        }
        return res.json(problems)
    })
}

exports.getAProblem = (req,res) => {
    if(req.problem){
        return res.json(req.problem)
    }
}

exports.recordProblem = (req,res) => {
    const {name,email,response} = req.body

    if(!name || !email || !response){
        return res.status(400).json({error: "All fields are required!",message: "MANDATORY FIELDS MISSING!"})
    }

    let problem = new Problem(req.body)

    problem.save((err,savedProblem)=>{
        if(err){
            return res.status(400).json({error: "Faild to record your response. Try again !",message: err})
        }
        return res.json({savedProblem})
    })
}

exports.updateProblem = (req,res) => {
    let problem = req.problem
    problem.status = req.body.status
    problem.save((err,updatedProblem)=>{
        if(err){
            return res.status(400).json({error: 'Faild to update problem status.',message: err})
        }
        return res.json(updatedProblem)
    })
}

exports.clearProblem = (req,res) => {
    let problem = req.problem
    problem.remove((err,removedProblem)=>{
        if(err){
            return res.status(400).json({error: 'Faild to delete problem.',message: err})
        }
        return res.json(removedProblem)
    })
}