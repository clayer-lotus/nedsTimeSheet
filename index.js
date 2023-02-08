const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const port  = process.env.PORT || 3000;

// NEDS
// const url = 'mongodb://tesla:abc123@13.238.185.225:27017/admin';

const url = 'mongodb+srv://lotusbiswas:lotusbiswas@cluster0.1zfsoap.mongodb.net/nedsTimeSheet'
const path = require('path')

// Initialize express server
const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());
mongoose.set('strictQuery', false);
mongoose.connect(url, {useNewUrlParser: true})

const con  = mongoose.connection

con.on('open', ()=>{
    console.log('connected');
})

// ROUTER
const timesheetRouter = require('./routes/timesheet');

app.use('/api/timesheet', timesheetRouter);

app.get('/',(req,res)=>{
    res.send({status:"running"});
})
app.listen(port,()=>{
    console.log( `App listing at ${port}`);
})