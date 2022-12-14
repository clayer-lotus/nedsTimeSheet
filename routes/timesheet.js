const express = require('express');
const timesheet = require('../models/timesheet');
const router = express.Router();

const Timesheet = require('../models/timesheet');

// CREATE TIMESHEET
router.post('/', async (req, res) => {
    try {
        let data = req.body;
        const timesheet = new Timesheet(data);
        await timesheet.save();
        res.json(timesheet);

        console.log('Timesheet ' + timesheet);

    } catch (err) {
        res.sendStatus(400);
        console.log('Error ' + err);
    }
});

// UPDATE FILE LINK
router.post('/update/fileLink/:piid/:fileLink', async (req, res) => {
    try{

        setTimeout(async function() {
            console.log(req.params.piid);
            const timesheet = await Timesheet.findOne({piid: req.params.piid});
            timesheet.leaveFileLink = "https://files.podio.com/" + req.params.fileLink;      
            const t1 = await timesheet.save();
            res.status(200).json(true);
          }, 20000);
       
    
    }catch (err) {
        res.status(502).send('Error ' + err);
    }
});

// GET ALL TIMESHEET REPORT BY PERSON ASSIGNED

router.get('/get/all/personAssigned', async (req, res) => {
    try {
        const timesheet = await Timesheet.aggregate([
            {
                $group: {
                    _id: '$personAssigned',
                    ordinaryHour: {
                        $sum: {
                            $convert:
                            {
                                input: "$ordinaryHours",
                                to: "double"
                            }
                        }
                    },
                    timeAndAHalf: {
                        $sum: {
                            $convert: {
                                input: "$timeAndHalf",
                                to: "double"
                            }
                        }
                    },
                    doubleTime: {
                        $sum: {
                            $convert: {
                                input: "$doubleTime",
                                to: "double"
                            }
                        }
                    }
                }
            },
            { $sort : { _id : 1 } }
        ])

        res.json(timesheet);
        console.log("Timesheet " + timesheet);
    } catch (err) {

    }
})

// GET RDOS BY LEAVE 

router.get('/get/all/rdo', async (req, res) => {
    try {
        const timesheet = await Timesheet.aggregate([
            {
                $match: {
                    "leaveCategory": "RDO"
                }
            },
            {
                $group: {
                    _id: "$personAssigned",
                    rdoHours: {
                        $sum: {
                            $convert: {
                                input: "$rdoHours",
                                to: "double"
                            }
                        }
                    }
                }
            }
        ])

        
        res.json(timesheet);
        console.log("Timesheet " + timesheet);
    } catch (err) {

    }
})

// GET SICK LEAVE 

router.get('/get/all/sickleave', async (req, res) => {
    try {
        const timesheet = await Timesheet.aggregate([
            {
                $match: {
                    "leaveCategory": "Sick leave"
                }
            },
            {
                $group: {
                    _id: "$personAssigned",
                    total: { $sum: 1 }
                }
            }
        ])

        
        res.json(timesheet);
        console.log("Timesheet " + timesheet);
    } catch (err) {

    }
})

// GET UNPAID LEAVE 

router.get('/get/all/unpaidleave', async (req, res) => {
    try {
        const timesheet = await Timesheet.aggregate([
            {
                $match: {
                    "leaveCategory": "Unpaid leave"
                }
            },
            {
                $group: {
                    _id: "$personAssigned",
                    total: { $sum: 1 }
                }
            }
        ])

        
        res.json(timesheet);
        console.log("Timesheet " + timesheet);
    } catch (err) {

    }
})

// GET ANNUAL LEAVE 

router.get('/get/all/annualleave', async (req, res) => {
    try {
        const timesheet = await Timesheet.aggregate([
            {
                $match: {
                    "leaveCategory": "Annual leave"
                }
            },
            {
                $group: {
                    _id: "$personAssigned",
                    total: { $sum: 1 }
                }
            }
        ])

        
        res.json(timesheet);
        console.log("Timesheet " + timesheet);
    } catch (err) {

    }
})

// GET PUBLIC HOLIDAY 

router.get('/get/all/publicholiday', async (req, res) => {
    try {
        const timesheet = await Timesheet.aggregate([
            {
                $match: {
                    "leaveCategory": "Public holiday"
                }
            },
            {
                $group: {
                    _id: "$personAssigned",
                    total: { $sum: 1 }
                }
            }
        ])

        if (timesheet.length == 0) {
            res.json([
                {
                    "_id": "Empty",
                    "total": 0
                }
            ]);
        }
        else {
            res.json(timesheet);
        }
        res.json(timesheet);
        console.log("Timesheet " + timesheet);
    } catch (err) {

    }
})


// GET ALL PERSONAL/CARERS LEAVE

router.get('/get/all/personalAndCaresLeave', async (req, res) => {
    try {
        const timesheet = await Timesheet.aggregate([
            {
                $match: { $or: [{ "leaveCategory": "Personal leave" }, { "leaveCategory": "Carers leave" }] }
            },
            {
                $group: {
                    _id: "$personAssigned",
                    total: { $sum: 1 }
                }
            }
        ])

        if (timesheet.length == 0) {
            res.json([
                {
                    "_id": "Empty",
                    "total": 0
                }
            ]);
        }
        else {
            res.json(timesheet);
        }
        res.json(timesheet);
        console.log("Timesheet " + timesheet);
    } catch (err) {

    }
})



// // GET ALL TIMESHEET HEAD REPORT DETILS FILTER BY DATE & NAME

router.get('/get/filter/head/timesheet', async(req,res)=>{
    try{
        let data = req.query;
        let personName =data.name;
        let startDate = data.startDate;
        let lastDate = data.lastDate;

        const convertStartUnixTodate = (startDate).concat("T00:00:00.000Z");
        const convertEndUnixTodate = (lastDate).concat("T00:00:00.000Z");

        console.log(convertStartUnixTodate);
        console.log(convertEndUnixTodate);
        
        const timesheet = await Timesheet.aggregate([
            {
                $match :{
                    "personAssigned": personName,
                    createdOn:
                    {
                        $gte: new Date(convertStartUnixTodate),
                        $lte: new Date(convertEndUnixTodate)
                    }
                }
            },
            {
                
                $group: {
                    _id: '$personAssigned',
                    ordinaryHour: {
                        $sum: {
                            $convert:
                            {
                                input: "$ordinaryHours",
                                to: "double"
                            }
                        }
                    },
                    timeAndAHalf: {
                        $sum: {
                            $convert: {
                                input: "$timeAndHalf",
                                to: "double"
                            }
                        }
                    },
                    doubleTime: {
                        $sum: {
                            $convert: {
                                input: "$doubleTime",
                                to: "double"
                            }
                        }
                    }
                }
            }
        ])

        res.json(timesheet);
        console.log("Timesheet " + timesheet);
    }catch(err)
    {
        res.sendStatus(400);
        console.log('Error ' + err);
    }
})


// GET ALL TIMESHEET REPORT DETILS FILTER BY DATE & NAME

router.get('/get/filter/timesheet', async(req,res)=>{
    try{
        let data = req.query;
        let personName =data.name;
        let startDate = data.startDate;
        let lastDate = data.lastDate;

        const convertStartUnixTodate = (startDate).concat("T00:00:00.000Z");
        const convertEndUnixTodate = (lastDate).concat("T00:00:00.000Z");

        console.log(convertStartUnixTodate);
        console.log(convertEndUnixTodate);
        
        const timesheet = await Timesheet.aggregate([
            {
                $match :{
                    "personAssigned": personName,
                    createdOn:
                    {
                        $gte: new Date(convertStartUnixTodate),
                        $lte: new Date(convertEndUnixTodate)
                    }
                }
            },
            { $sort: { createdOn : 1 } } 
        ])

        res.json(timesheet);
        console.log("Timesheet " + timesheet);
    }catch(err)
    {
        res.sendStatus(400);
        console.log('Error ' + err);
    }
})

// FILTER BY START AND END DATE

// // GET ALL TIMESHEET HEAD REPORT DETILS FILTER BY DATE & NAME

router.get('/get/filter/home/timesheet', async(req,res)=>{
    try{
        let data = req.query;
        let startDate = data.startDate;
        let lastDate = data.lastDate;

        const convertStartUnixTodate = (startDate).concat("T00:00:00.000Z");
        const convertEndUnixTodate = (lastDate).concat("T00:00:00.000Z");

        console.log(convertStartUnixTodate);
        console.log(convertEndUnixTodate);
        
        const timesheet = await Timesheet.aggregate([
            {
                $match :{
                    createdOn:
                    {
                        $gte: new Date(convertStartUnixTodate),
                        $lte: new Date(convertEndUnixTodate)
                    }
                }
            },
            {
                
                $group: {
                    _id: '$personAssigned',
                    ordinaryHour: {
                        $sum: {
                            $convert:
                            {
                                input: "$ordinaryHours",
                                to: "double"
                            }
                        }
                    },
                    timeAndAHalf: {
                        $sum: {
                            $convert: {
                                input: "$timeAndHalf",
                                to: "double"
                            }
                        }
                    },
                    doubleTime: {
                        $sum: {
                            $convert: {
                                input: "$doubleTime",
                                to: "double"
                            }
                        }
                    }
                }
            },
            { $sort: { _id : 1 } } 
        ])

        res.json(timesheet);
        console.log("Timesheet " + timesheet);
    }catch(err)
    {
        res.sendStatus(400);
        console.log('Error ' + err);
    }
})


module.exports = router;