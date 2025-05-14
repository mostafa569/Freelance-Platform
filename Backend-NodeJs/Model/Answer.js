const { Schema, default: mongoose } = require("mongoose");

const Answer = new Schema({
    attemptId: {
        type: mongoose.Schema.ObjectId,
        ref: 'AttemptExam',
        required: true,
    },
    questionId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Question',
        required: true,
    },
    selectedOptionId: {
        type: mongoose.Schema.ObjectId,
        ref: 'QuestionOpetion',
        default: null, 
    },
    score: {
        type: Number,
        default: 0,
        min: 0,
    },
    answerText: {
        type: String,
        default: null,
    },
}, { timestamps: true });
module.exports = mongoose.model('Answer',Answer)