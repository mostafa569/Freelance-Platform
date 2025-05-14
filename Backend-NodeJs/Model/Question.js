const { Schema, default: mongoose } = require("mongoose");

const Question = new Schema({
    examId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Exam',
        // required: true,
    },
    questionText: {
        type: String,
        required: true,
        minlength: 5,
    },
    questionType: {
        type: String,
        enum: ['multiple_choice', 'true_false'],
        required: true,
    },
    points: {
        type: Number,
        default: 1,
        min: 1,
    },
}, { timestamps: true });
module.exports = mongoose.model('Question',Question);