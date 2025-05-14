const express = require('express');
const { default: mongoose } = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const questionRoute = require('./routes/questionRoute');
const ThrowMessage = require('./utils/ThrowMessage');
const optionRoute = require('./routes/optionRoute');
const authRoute = require('./routes/authRoute');
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
app.get('/',function(req,res){
    res.json({
        message:"success",
    })
})
app.use('/auth',authRoute);
app.use('/exams',questionRoute);
app.use('/questions',optionRoute);



/////not found path
app.use((req,res,next)=>{
    next(new ThrowMessage(404,"Page Not Founded"));
})
///global error handler
app.use((error,req,res)=>{
    res.status(error.statusCode || 500).json({
        message : error.message || "Try Again Later",
        status:"fail",
    })
})
mongoose.connect('mongodb://localhost:27017/finalAngularNode').then((res)=>console.log("success")).catch((rej)=>console.log("fail"));
const port = 9100;
app.listen(port,()=>{
    console.log("success");
})
