const { Schema, default: mongoose } = require("mongoose");

const Exam = new Schema({
    title:{
        type:String,
        required:true,
        minlength:3,
    },
    description:{
        type:String,
        required:false,
        minlength:3,
    },
    created_by:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true,
    },
},
{
    timestamps:true,
});
module.exports = mongoose.model('Exam',Exam);
