const mongoose = require('mongoose')

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Technical question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, {
    _id: false
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"]
    },

    resume: {
        type: String,
    },
    selfDescription: {
        type: String
    },
    matchScore: {
        type: Number,
        min:0,
        max:100,
    },
    technicalQuestions: []
})