const express = require('express');
const timesheet = require('../models/timesheet');
const router = express.Router();

const Timesheet = require('../models/timesheet');;
var credentials = {
    app_id: '28016925',
    app_token: '4997c3dd5c75f7ca37c900d2f2a4d9e4',
    client_id: 'teslalifts',
    client_secret: 'bf3dgnFsHCW4Kk2pugnRJOilyKgxSSCgbTwUBbHmHTH9TTXjbBPtG6aPYqwJAweo'
};
var nodio = require('nodio')(credentials);

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

router.put('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const newData = req.body;
    
        Timesheet.updateOne({ piid: id }, { $set: newData }, (err, result) => {
            if (err) throw err;
      
            res.json(result);
          });

    } catch (err) {
        res.sendStatus(400);
        console.log('Error ' + err);
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
          Timesheet.deleteOne({ piid: id }, (err, result) => {
            if (err) throw err;
      
            res.json(result);
          });

    } catch (err) {
        res.sendStatus(400);
        console.log('Error ' + err);
    }
});

// UPDATE FILE LINK
router.post('/update/fileLink/:piid', async (req, res) => {
    try {
        setTimeout(async function() {
            console.log(req.params.piid);

            var item_id  = req.params.piid;
            const timesheet = await Timesheet.findOne({piid: req.params.piid});
            nodio.getItem(item_id, async function (err, item_info) {
                if(err){
                    // Error
                    console.log(err);
                }
                else{
                    // Item retrieved successfully
                   
                    timesheet.leaveFileLink = item_info.files[0].link;      
                    const t1 = await timesheet.save();
                    res.status(200).json(true);
                }
            });
           
          }, 20000);


    } catch (err) {
        res.status(502).send('Error ' + err);
    }
});

// GET ALL TIMESHEET REPORT BY PERSON ASSIGNED

router.get('/get/all/personAssigned', async (req, res) => {
    try {
        let data = req.query;

        let startDate = data.startDate;
        let lastDate = data.endDate;

        const convertStartUnixTodate = (startDate).concat("T00:00:00.000Z");
        const convertEndUnixTodate = (lastDate).concat("T00:00:00.000Z");

        console.log(convertStartUnixTodate);
        console.log(convertEndUnixTodate);

        const timesheet = await Timesheet.aggregate([{
                $match: {
                    createdOn: {
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
                            $convert: {
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
            {
                $sort: {
                    _id: 1
                }
            }
        ])

        res.json(timesheet);
        console.log("Timesheet " + timesheet);
    } catch (err) {

    }
})

// GET RDOS BY LEAVE 

router.get('/get/all/rdo', async (req, res) => {
    try {

        let data = req.query;

        let startDate = data.startDate;
        let lastDate = data.lastDate;

        const convertStartUnixTodate = (startDate).concat("T00:00:00.000Z");
        const convertEndUnixTodate = (lastDate).concat("T00:00:00.000Z");

        console.log(convertStartUnixTodate);
        console.log(convertEndUnixTodate);

        const timesheet = await Timesheet.aggregate([{
                $match: {
                    "$and": [{
                            createdOn: {
                                $gte: new Date(convertStartUnixTodate),
                                $lte: new Date(convertEndUnixTodate)
                            }
                        },
                        {
                            "leaveCategory": "RDO"
                        }
                    ]
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
        let data = req.query;

        let startDate = data.startDate;
        let lastDate = data.lastDate;

        const convertStartUnixTodate = (startDate).concat("T00:00:00.000Z");
        const convertEndUnixTodate = (lastDate).concat("T00:00:00.000Z");

        console.log(convertStartUnixTodate);
        console.log(convertEndUnixTodate);

        const timesheet = await Timesheet.aggregate([{
                $match: {
                    "$and": [{
                            createdOn: {
                                $gte: new Date(convertStartUnixTodate),
                                $lte: new Date(convertEndUnixTodate)
                            }
                        },
                        {
                            "leaveCategory": "Sick leave"
                        }
                    ]
                }
            },
            {
                $group: {
                    _id: "$personAssigned",
                    total: {
                        $sum: 1
                    }
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
        let data = req.query;

        let startDate = data.startDate;
        let lastDate = data.lastDate;

        const convertStartUnixTodate = (startDate).concat("T00:00:00.000Z");
        const convertEndUnixTodate = (lastDate).concat("T00:00:00.000Z");

        console.log(convertStartUnixTodate);
        console.log(convertEndUnixTodate);

        const timesheet = await Timesheet.aggregate([{
                $match: {
                    "$and": [{
                            createdOn: {
                                $gte: new Date(convertStartUnixTodate),
                                $lte: new Date(convertEndUnixTodate)
                            }
                        },
                        {
                            "leaveCategory": "Unpaid leave"
                        }
                    ]
                }
            },
            {
                $group: {
                    _id: "$personAssigned",
                    total: {
                        $sum: 1
                    }
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
        let data = req.query;

        let startDate = data.startDate;
        let lastDate = data.lastDate;

        const convertStartUnixTodate = (startDate).concat("T00:00:00.000Z");
        const convertEndUnixTodate = (lastDate).concat("T00:00:00.000Z");

        console.log(convertStartUnixTodate);
        console.log(convertEndUnixTodate);

        const timesheet = await Timesheet.aggregate([{
                $match: {
                    "$and": [{
                            createdOn: {
                                $gte: new Date(convertStartUnixTodate),
                                $lte: new Date(convertEndUnixTodate)
                            }
                        },
                        {
                            "leaveCategory": "Annual leave"
                        }
                    ]
                }
            },
            {
                $group: {
                    _id: "$personAssigned",
                    total: {
                        $sum: 1
                    }
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

        let data = req.query;

        let startDate = data.startDate;
        let lastDate = data.lastDate;

        const convertStartUnixTodate = (startDate).concat("T00:00:00.000Z");
        const convertEndUnixTodate = (lastDate).concat("T00:00:00.000Z");

        console.log(convertStartUnixTodate);
        console.log(convertEndUnixTodate);

        const timesheet = await Timesheet.aggregate([{
                $match: {
                    "$and": [{
                            createdOn: {
                                $gte: new Date(convertStartUnixTodate),
                                $lte: new Date(convertEndUnixTodate)
                            }
                        },
                        {
                            "leaveCategory": "Public holiday"
                        }
                    ]
                }
            },
            {
                $group: {
                    _id: "$personAssigned",
                    total: {
                        $sum: 1
                    }
                }
            }
        ])

        if (timesheet.length == 0) {
            res.json([{
                "_id": "Empty",
                "total": 0
            }]);
        } else {
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
        let data = req.query;

        let startDate = data.startDate;
        let lastDate = data.lastDate;

        const convertStartUnixTodate = (startDate).concat("T00:00:00.000Z");
        const convertEndUnixTodate = (lastDate).concat("T00:00:00.000Z");

        console.log(convertStartUnixTodate);
        console.log(convertEndUnixTodate);

        const timesheet = await Timesheet.aggregate([{
                $match: {
                    "$and": [{
                            createdOn: {
                                $gte: new Date(convertStartUnixTodate),
                                $lte: new Date(convertEndUnixTodate)
                            }
                        },
                        {
                            $or: [{
                                "leaveCategory": "Personal leave"
                            }, {
                                "leaveCategory": "Carers leave"
                            }]
                        }
                    ]
                }
            },
            {
                $group: {
                    _id: "$personAssigned",
                    total: {
                        $sum: 1
                    }
                }
            }
        ])

        if (timesheet.length == 0) {
            res.json([{
                "_id": "Empty",
                "total": 0
            }]);
        } else {
            res.json(timesheet);
        }
        res.json(timesheet);
        console.log("Timesheet " + timesheet);
    } catch (err) {

    }
})



// // GET ALL TIMESHEET HEAD REPORT DETILS FILTER BY DATE & NAME

router.get('/get/filter/head/timesheet', async (req, res) => {
    try {
        let data = req.query;
        let personName = data.name;
        let startDate = data.startDate;
        let lastDate = data.lastDate;

        const convertStartUnixTodate = (startDate).concat("T00:00:00.000Z");
        const convertEndUnixTodate = (lastDate).concat("T00:00:00.000Z");

        console.log(convertStartUnixTodate);
        console.log(convertEndUnixTodate);

        const timesheet = await Timesheet.aggregate([{
                $match: {
                    "personAssigned": personName,
                    createdOn: {
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
                            $convert: {
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
    } catch (err) {
        res.sendStatus(400);
        console.log('Error ' + err);
    }
})


// GET ALL TIMESHEET REPORT DETILS FILTER BY DATE & NAME

router.get('/get/filter/timesheet', async (req, res) => {
    try {
        let data = req.query;
        let personName = data.name;
        let startDate = data.startDate;
        let lastDate = data.lastDate;

        const convertStartUnixTodate = (startDate).concat("T00:00:00.000Z");
        const convertEndUnixTodate = (lastDate).concat("T00:00:00.000Z");

        console.log(convertStartUnixTodate);
        console.log(convertEndUnixTodate);

        const timesheet = await Timesheet.aggregate([{
                $match: {
                    "personAssigned": personName,
                    createdOn: {
                        $gte: new Date(convertStartUnixTodate),
                        $lte: new Date(convertEndUnixTodate)
                    }
                }
            },
            {
                $sort: {
                    createdOn: 1
                }
            }
        ])

        res.json(timesheet);
        console.log("Timesheet " + timesheet);
    } catch (err) {
        res.sendStatus(400);
        console.log('Error ' + err);
    }
})

// FILTER BY START AND END DATE

// // GET ALL TIMESHEET HEAD REPORT DETILS FILTER BY DATE & NAME

router.get('/get/filter/home/timesheet', async (req, res) => {
    try {
        let data = req.query;
        let startDate = data.startDate;
        let lastDate = data.lastDate;

        const convertStartUnixTodate = (startDate).concat("T00:00:00.000Z");
        const convertEndUnixTodate = (lastDate).concat("T00:00:00.000Z");

        console.log(convertStartUnixTodate);
        console.log(convertEndUnixTodate);

        const timesheet = await Timesheet.aggregate([{
                $match: {
                    createdOn: {
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
                            $convert: {
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
            {
                $sort: {
                    _id: 1
                }
            }
        ])

        res.json(timesheet);
        console.log("Timesheet " + timesheet);
    } catch (err) {
        res.sendStatus(400);
        console.log('Error ' + err);
    }
})


module.exports = router;