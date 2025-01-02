const mongoose = require('mongoose')

const quizeSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    questions:[{
        question:String,
        options:[String],
        correctAnswer:String
    }]
})

module.exports =mongoose.model('Quiz',quizeSchema)