//career.js

const mongoose = require('mongoose')

const careerSchema = new mongoose.Schema({
    name: String, 
    email: String, 
    password: String
})

const careerModel = mongoose.model("careers", careerSchema)
module.exports = careerModel