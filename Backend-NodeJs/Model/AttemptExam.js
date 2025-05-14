const { Schema, default: mongoose } = require("mongoose");

const AttemptExam=new Schema({
    examId:{type:mongoose.Schema.ObjectId,ref:'Exam',required:true},
    userId:{type:mongoose.Schema.ObjectId,ref:'User',required:true},
    totalScore:{type:Number,default:0,min:0}
},{
    timestamps: true,
})
module.exports = mongoose.model('AttemptExam' , AttemptExam);