const { Schema, default: mongoose } = require("mongoose");
const bcryptjs = require('bcryptjs');

const User = new Schema({
    username:{
        type:String,
        minlength:3,
        required:true,
        validate:{validator:function(v){
            return /^[A-Za-z]{3,}$/.test(v);
        },
        message:"Not Valid Name",
    }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator:function (v){
                return /^[a-zA-Z0-9*#&_-]+@gmail\.com$/.test(v);
            },
            message:"Not Valid Email"
        }
    },
    password:{
        type:String,
        required:true,
        minlength:5,
        validate:{
            validator:function (v){
                return /^[a-zA-Z]{5,}$/.test(v);
            },
            message:"Not Valid Password"
        }
    },
    role:{
        type:String,
        required:false,
        enum:["student","teacher"],
        default:"student",
    },
},{timestamps:true});
User.pre('save', async function (next) {
    const slat = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(this.password, slat);
    this.password = hashedPassword;
    next();
})
module.exports = mongoose.model('User',User);