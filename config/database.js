const mongoose = require('mongoose');

require("dotenv").config();

exports.connect = () =>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then( ()=>{
        console.log('Connected to Db successfully')
    })
    .catch( (err)=>{
        console.log('Error connecting to Db');
        console.error(err);
        process.exit(1);
    })
}