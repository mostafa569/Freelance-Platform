const { Schema, default: mongoose } = require("mongoose");

const QuestionOpetion = new Schema({
    questionId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Question',
        required: true,
    },
    optionText: {
        type: String,
        required: true,
    },
    isCorrect: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('QuestionOpetion',QuestionOpetion);