const express = require('express');
const router = express.Router();

const Timesheet = require('../models/timesheet');

// CREATE TIMESHEET
router.post('/', async(req,res)=>{
    try{
        let data = req.body;
        const timesheet = new Timesheet(data);
        await timesheet.save();
        res.json(timesheet);

        console.log('Timesheet ' + timesheet);

    }catch(err)
    {
        res.sendStatus(400);
        console.log('Error '+ err);
    }
})

module.exports = router;