import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { TimesheetService } from 'src/app/services/timesheet/timesheet.service';
// import {moment} from  'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  dataHours: any = [];
  dataRDOs: any = [];
  dataAnnualLeave: any = [];
  dataUnpaidLeave: any = [];
  dataPublicHoliday: any = [];
  startDate !: string ;
  endDate !: string;
  // dataTripleTime: any = [];
  dataPersonalCaresLeave: any = [];


  isAdminOfficeAccounts:  any = "Yes";
  timesheetData: any = [];

  personName !: string;
  from !: string;
  to !: string;
  headTimesheetData: any = [];
  sheetDismantleData: any = [];
  totalKms: number = 0;
  totalTimespent: number = 0;
  totalKmsArr: any = [];

  constructor(private _timesheet: TimesheetService) {
    this.startDate = new Date().toISOString().slice(0, 16);
    this.setDefaultStartAndEndDate();
  }

  ngOnInit(): void {

    const firstTime = localStorage.getItem('key')
    if(!firstTime){
     localStorage.setItem('key','loaded')
     location.reload()
    }else {
      localStorage.removeItem('key') 
    }

    const today = new Date();

    const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
    
    var year = firstDay.toLocaleString("default", { year: "numeric" });
    var month = firstDay.toLocaleString("default", { month: "2-digit" });
    var day = firstDay.toLocaleString("default", { day: "2-digit" });
    var formattedStartDate = year + "-" + month + "-" + day;
    console.log(formattedStartDate);

    this.startDate = formattedStartDate;
    console.log(this.startDate); 

    const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    var year = lastDay.toLocaleString("default", { year: "numeric" });
    var month = lastDay.toLocaleString("default", { month: "2-digit" });
    var day = lastDay.toLocaleString("default", { day: "2-digit" });
    var formattedEndDate = year + "-" + month + "-" + day;
    console.log(formattedEndDate);

    this.endDate = formattedEndDate;
    
    console.log(this.endDate); 
    
    this.setDefaultStartAndEndDate();
    this.getAllByHours();
   
  }
  

  setDefaultStartAndEndDate() {
  

    this._timesheet.getFilterHomeTimesheet(this.startDate, this.endDate).subscribe(
      res => {
        console.log(res);
        // this.from = this.startDate;
        // this.to = this.endDate;

       

        this.dataHours = res;
        for(var j=0;j<this.dataHours.length;j++)
        {
          // this.personName =  this.dataHours[j]._id;
          // console.log(this.personName);
          this.getFilterTimesheetFunc(this.startDate, this.endDate, this.dataHours[j]._id);
  
        }
      
        for (var i = 0; i < this.dataHours.length; i++) {
          this.dataHours[i].rdoHours = 0;
          this.dataHours[i].unpaidleave = 0;
          this.dataHours[i].publicHoliday = 0;
          this.dataHours[i].annualleave = 0;
          this.dataHours[i].personalAndCares = 0;
          this.dataHours[i].tripleTime = 0;
         
   
        }
        // console.log(this.dataHours);

        // GET ALL RDOS
        this._timesheet.getAllRDOs(this.startDate, this.endDate).subscribe(
          res => {
            this.dataRDOs = res;
            for (var i = 0; i < this.dataRDOs.length; i++) {
              for (var j = 0; j < this.dataHours.length; j++) {

                if (this.dataRDOs[i]._id == this.dataHours[j]._id) {
                  this.dataHours[j].rdoHours = this.dataRDOs[i].rdoHours;
                }
              }

            }
          },
          err => {

          }
        )
        // GET ALL ANNUUAL Leave
        this._timesheet.getAllAnnualLeave(this.startDate, this.endDate).subscribe(
          res => {
            this.dataAnnualLeave = res;
            for (var i = 0; i < this.dataAnnualLeave.length; i++) {
              for (var j = 0; j < this.dataHours.length; j++) {
                if (this.dataAnnualLeave[i]._id == this.dataHours[j]._id) {
                  this.dataHours[j].annualleave = this.dataAnnualLeave[i].total * 7.2;
                }

              }

            }
          },
          err => {

          }
        )

        // GET ALL UNPAID Leave
        this._timesheet.getAllUnpaidLeave(this.startDate, this.endDate).subscribe(
          res => {
            this.dataUnpaidLeave = res;

            for (var i = 0; i < this.dataUnpaidLeave.length; i++) {
              for (var j = 0; j < this.dataHours.length; j++) {
                if (this.dataUnpaidLeave[i]._id == this.dataHours[j]._id) {
                  this.dataHours[j].unpaidleave = this.dataUnpaidLeave[i].total * 7.2;
                }

              }

            }
          },
          err => {

          }
        )

        // GET ALL PUBLIC HOLDIAY 
        this._timesheet.getAllPublicHoliday(this.startDate, this.endDate).subscribe(
          res => {
            this.dataPublicHoliday = res;
            console.log(this.startDate + " "+ this.endDate);
            console.log(this.dataPublicHoliday);
            for (var i = 0; i < this.dataPublicHoliday.length; i++) {
              for (var j = 0; j < this.dataHours.length; j++) {
                if (this.dataPublicHoliday[i]._id == this.dataHours[j]._id) {
                  this.dataHours[j].publicHoliday = this.dataPublicHoliday[i].total * 7.2;
                  this.dataHours[j].tripleTime = this.dataPublicHoliday[i].total * 7.0;
                }

              }

            }
          },
          err => {

          }
        )

        // GET ALL PERSONAL/CARES LEAVE
        this._timesheet.getAllPersonalCaresLeave(this.startDate, this.endDate).subscribe(
          res => {
            this.dataPersonalCaresLeave = res;
            for (var i = 0; i < this.dataPersonalCaresLeave.length; i++) {
              for (var j = 0; j < this.dataHours.length; j++) {
                if (this.dataPersonalCaresLeave[i]._id == this.dataHours[j]._id) {
                  this.dataHours[j].personalAndCares = this.dataPersonalCaresLeave[i].total * 7.2;
                  console.log(this.dataHours[j].personalAndCares);

                }

              }

            }
          },
          err => {

          }
        )




        console.log(this.dataHours);
      }, err => {

      }
    )
  }

  searchFor() {
    this.totalKmsArr = [];
    console.log(this.startDate.toString());
    var startdate = new Date(this.startDate.toString());

    // Get year, month, and day part from the date
    var year = startdate.toLocaleString("default", { year: "numeric" });
    var month = startdate.toLocaleString("default", { month: "2-digit" });
    var day = startdate.toLocaleString("default", { day: "2-digit" });
    var formattedStartDate = year + "-" + month + "-" + day;
    console.log(formattedStartDate);

    this.startDate = formattedStartDate;

    var enddate = new Date(this.endDate.toString());

    // Get year, month, and day part from the date
    var year = enddate.toLocaleString("default", { year: "numeric" });
    var month = enddate.toLocaleString("default", { month: "2-digit" });
    var day = enddate.toLocaleString("default", { day: "2-digit" });
    var formattedEndDate = year + "-" + month + "-" + day;
    console.log(formattedEndDate);

    this.endDate = formattedEndDate;

    this._timesheet.getFilterHomeTimesheet(formattedStartDate, formattedEndDate).subscribe(
      res => {
        console.log(res);

        // this.from = formattedStartDate;
        // this.to = formattedEndDate;

        this.dataHours = res;
        for(var j=0;j<this.dataHours.length;j++)
        {
          // this.personName =  this.dataHours[j]._id;
          // console.log(this.personName);
          this.getFilterTimesheetFunc(formattedStartDate, formattedEndDate, this.dataHours[j]._id);
  
        }
        for (var i = 0; i < this.dataHours.length; i++) {
          this.dataHours[i].rdoHours = 0;
          this.dataHours[i].unpaidleave = 0;
          this.dataHours[i].publicHoliday = 0;
          this.dataHours[i].annualleave = 0;
          this.dataHours[i].personalAndCares = 0;
          this.dataHours[i].tripleTime = 0;
          
        }
        // console.log(this.dataHours);

        // GET ALL RDOS
        this._timesheet.getAllRDOs(this.startDate, this.endDate).subscribe(
          res => {
            this.dataRDOs = res;
            for (var i = 0; i < this.dataRDOs.length; i++) {
              for (var j = 0; j < this.dataHours.length; j++) {

                if (this.dataRDOs[i]._id == this.dataHours[j]._id) {
                  this.dataHours[j].rdoHours = this.dataRDOs[i].rdoHours;
                }
              }

            }
          },
          err => {

          }
        )
        // GET ALL ANNUUAL Leave
        this._timesheet.getAllAnnualLeave(this.startDate, this.endDate).subscribe(
          res => {
            this.dataAnnualLeave = res;
            for (var i = 0; i < this.dataAnnualLeave.length; i++) {
              for (var j = 0; j < this.dataHours.length; j++) {
                if (this.dataAnnualLeave[i]._id == this.dataHours[j]._id) {
                  this.dataHours[j].annualleave = this.dataAnnualLeave[i].total * 7.2;
                }

              }

            }
          },
          err => {

          }
        )

        // GET ALL UNPAID Leave
        this._timesheet.getAllUnpaidLeave(this.startDate, this.endDate).subscribe(
          res => {
            this.dataUnpaidLeave = res;

            for (var i = 0; i < this.dataUnpaidLeave.length; i++) {
              for (var j = 0; j < this.dataHours.length; j++) {
                if (this.dataUnpaidLeave[i]._id == this.dataHours[j]._id) {
                  this.dataHours[j].unpaidleave = this.dataUnpaidLeave[i].total * 7.2;
                }

              }

            }
          },
          err => {

          }
        )

        // GET ALL PUBLIC HOLDIAY 
        this._timesheet.getAllPublicHoliday(this.startDate, this.endDate).subscribe(
          res => {
            this.dataPublicHoliday = res;
            for (var i = 0; i < this.dataPublicHoliday.length; i++) {
              for (var j = 0; j < this.dataHours.length; j++) {
                if (this.dataPublicHoliday[i]._id == this.dataHours[j]._id) {
                  this.dataHours[j].publicHoliday = this.dataPublicHoliday[i].total * 7.2;
                  this.dataHours[j].tripleTime = this.dataPublicHoliday[i].total * 7.0;
                }

              }

            }
          },
          err => {

          }
        )

        // GET ALL PERSONAL/CARES LEAVE
        this._timesheet.getAllPersonalCaresLeave(this.startDate, this.endDate).subscribe(
          res => {
            this.dataPersonalCaresLeave = res;
            for (var i = 0; i < this.dataPersonalCaresLeave.length; i++) {
              for (var j = 0; j < this.dataHours.length; j++) {
                if (this.dataPersonalCaresLeave[i]._id == this.dataHours[j]._id) {
                  this.dataHours[j].personalAndCares = this.dataPersonalCaresLeave[i].total * 7.2;
                  console.log(this.dataHours[j].personalAndCares);

                }

              }

            }
          },
          err => {

          }
        )




        console.log(this.dataHours);
      }, err => {

      }
    )
  };

  getAllByHours() {

  var formattedStartDate = this.startDate;
  var formattedEndDate = this.endDate;

    this._timesheet.getAllHours(formattedStartDate, formattedEndDate).subscribe(
      res => {
        this.dataHours = res;

        for (var i = 0; i < this.dataHours.length; i++) {
          this.dataHours[i].rdoHours = 0;
          this.dataHours[i].unpaidleave = 0;
          this.dataHours[i].publicHoliday = 0;
          this.dataHours[i].annualleave = 0;
          this.dataHours[i].personalAndCares = 0;
          this.dataHours[i].tripleTime = 0;
        }
        // console.log(this.dataHours);

        // GET ALL RDOS
        this._timesheet.getAllRDOs(this.startDate, this.endDate).subscribe(
          res => {
            this.dataRDOs = res;
            for (var i = 0; i < this.dataRDOs.length; i++) {
              for (var j = 0; j < this.dataHours.length; j++) {

                if (this.dataRDOs[i]._id == this.dataHours[j]._id) {
                  this.dataHours[j].rdoHours = this.dataRDOs[i].rdoHours;
                }
              }

            }
          },
          err => {

          }
        )
        // GET ALL ANNUUAL Leave
        this._timesheet.getAllAnnualLeave(this.startDate, this.endDate).subscribe(
          res => {
            this.dataAnnualLeave = res;
            for (var i = 0; i < this.dataAnnualLeave.length; i++) {
              for (var j = 0; j < this.dataHours.length; j++) {
                if (this.dataAnnualLeave[i]._id == this.dataHours[j]._id) {
                  this.dataHours[j].annualleave = this.dataAnnualLeave[i].total * 7.2;
                }

              }

            }
          },
          err => {

          }
        )

        // GET ALL UNPAID Leave
        this._timesheet.getAllUnpaidLeave(this.startDate, this.endDate).subscribe(
          res => {
            this.dataUnpaidLeave = res;

            for (var i = 0; i < this.dataUnpaidLeave.length; i++) {
              for (var j = 0; j < this.dataHours.length; j++) {
                if (this.dataUnpaidLeave[i]._id == this.dataHours[j]._id) {
                  this.dataHours[j].unpaidleave = this.dataUnpaidLeave[i].total * 7.2;
                }

              }

            }
          },
          err => {

          }
        )

        // GET ALL PUBLIC HOLDIAY 
        this._timesheet.getAllPublicHoliday(this.startDate, this.endDate).subscribe(
          res => {
            this.dataPublicHoliday = res;
            for (var i = 0; i < this.dataPublicHoliday.length; i++) {
              for (var j = 0; j < this.dataHours.length; j++) {
                if (this.dataPublicHoliday[i]._id == this.dataHours[j]._id) {
                  this.dataHours[j].publicHoliday = this.dataPublicHoliday[i].total * 7.2;
                  this.dataHours[j].tripleTime = this.dataPublicHoliday[i].total * 7.0;
                }

              }

            }
          },
          err => {

          }
        )

        // GET ALL PERSONAL/CARES LEAVE
        this._timesheet.getAllPersonalCaresLeave(this.startDate, this.endDate).subscribe(
          res => {
            this.dataPersonalCaresLeave = res;
            for (var i = 0; i < this.dataPersonalCaresLeave.length; i++) {
              for (var j = 0; j < this.dataHours.length; j++) {
                if (this.dataPersonalCaresLeave[i]._id == this.dataHours[j]._id) {
                  this.dataHours[j].personalAndCares = this.dataPersonalCaresLeave[i].total * 7.2;
                  console.log(this.dataHours[j].personalAndCares);

                }

              }

            }
          },
          err => {

          }
        )




        console.log(this.dataHours);
      }, err => {

      }
    )
  }

  


  getFilterTimesheetFunc(getStartDate : string, getEndDate : string, getPersonName : string) {
    this._timesheet.getFilterTimesheet(getStartDate,getEndDate, getPersonName).subscribe(
      res => {
        this.timesheetData = res;
        console.log(this.timesheetData);
        for(var i=0;i<this.timesheetData.length;i++){
          if(this.timesheetData[i].adminOfficeAccounts == 'No'){
            this.isAdminOfficeAccounts = 'No';
          }
        }
        console.log(this.isAdminOfficeAccounts);
        this.dismantleData(getPersonName);
      },
      err => {

      }
    )
  }

  dismantleData(getPersonName: string) {
    this.totalKms = 0;
    this.totalTimespent =0

    for (var i = 0; i < this.timesheetData.length; i++) {
      
      if (this.timesheetData[i].leave == "No") {
        if (this.timesheetData[i].job1DistanceFrom != '' && this.timesheetData[i].job1DistanceTo != '' && this.timesheetData[i].category1 == "Installation" ) {

          var obj = {
            date : this.timesheetData[i].createdOn,
            isLeave: "No",
            categoryType: "Installation",
            details :[{}]
          }
          var job1 = {
            from: this.timesheetData[i].job1DistanceFrom,
            to: this.timesheetData[i].job1DistanceTo,
            kms: this.timesheetData[i].job1Kms,
            timespent: this.timesheetData[i].job1TimeSpent
          }

          this.totalKms += Number(this.timesheetData[i].job1Kms);
          this.totalTimespent += Number(this.timesheetData[i].job1TimeSpent);

          obj.details.push(job1);
         
          this.sheetDismantleData.push(obj);
        }
        if (this.timesheetData[i].category1 == "Maintenance" || this.timesheetData[i].category2 == "Maintenance" || this.timesheetData[i].category3 == "Maintenance"|| this.timesheetData[i].category4 == "Maintenance" ||this.timesheetData[i].category5 == "Maintenance") {
          var obj = {
            date : this.timesheetData[i].createdOn,
            isLeave: "No",
            categoryType: "Maintenance",
            details :[{}]
          }
          var job5 = {
            from: this.timesheetData[i].job5DistanceFrom,
            to: this.timesheetData[i].job5DistanceTo,
            kms: this.timesheetData[i].totalKms,
            timespent: this.timesheetData[i].totalTimeSpent
          }
          
          this.totalKms += Number(this.timesheetData[i].totalKms);
          this.totalTimespent += Number(this.timesheetData[i].totalTimeSpent);
          obj.details.push(job5);
         
      
          
      this.sheetDismantleData.push(obj);
        }
        if (this.timesheetData[i].job2DistanceFrom != '' && this.timesheetData[i].job2DistanceTo != '' && this.timesheetData[i].category2 == "Installation" ) {
          var obj = {
            date : this.timesheetData[i].createdOn,
            isLeave: "No",
            categoryType: "Installation",
            details :[{}]
          }
          var job2 = {
            from: this.timesheetData[i].job2DistanceFrom,
            to: this.timesheetData[i].job2DistanceTo,
            kms: this.timesheetData[i].job2Kms,
            timespent: this.timesheetData[i].job2TimeSpent
          }
          
          this.totalKms += Number(this.timesheetData[i].job2Kms);
          this.totalTimespent += Number(this.timesheetData[i].job2TimeSpent);
          obj.details.push(job2);
         
      
          
      this.sheetDismantleData.push(obj);
        }
        if (this.timesheetData[i].job3DistanceFrom != '' && this.timesheetData[i].job3DistanceTo != '' && this.timesheetData[i].category3 == "Installation" ) {
          var obj = {
            date : this.timesheetData[i].createdOn,
            isLeave: "No",
            categoryType: "Installation",
            details :[{}]
          }
          var job3 = {
            from: this.timesheetData[i].job3DistanceFrom,
            to: this.timesheetData[i].job3DistanceTo,
            kms: this.timesheetData[i].job3Kms,
            timespent: this.timesheetData[i].job3TimeSpent
          }
          
          this.totalKms += Number(this.timesheetData[i].job3Kms);
          this.totalTimespent += Number(this.timesheetData[i].job3TimeSpent);
          obj.details.push(job3);
         
      
          
      this.sheetDismantleData.push(obj);
        }
        if (this.timesheetData[i].job4DistanceFrom != '' && this.timesheetData[i].job4DistanceTo != '' && this.timesheetData[i].category4 == "Installation" ) {
          var obj = {
            date : this.timesheetData[i].createdOn,
            isLeave: "No",
            categoryType: "Installation",
            details :[{}]
          }
          var job4 = {
            from: this.timesheetData[i].job4DistanceFrom,
            to: this.timesheetData[i].job4DistanceTo,
            kms: this.timesheetData[i].job4Kms,
            timespent: this.timesheetData[i].job4TimeSpent
          }
          
          this.totalKms += Number(this.timesheetData[i].job4Kms);
          this.totalTimespent += Number(this.timesheetData[i].job4TimeSpent);
          obj.details.push(job4);
         
      
          
      this.sheetDismantleData.push(obj);
        }
        if (this.timesheetData[i].job5DistanceFrom != '' && this.timesheetData[i].job5DistanceTo != '' && this.timesheetData[i].category4 == "Installation") {
          var obj = {
            date : this.timesheetData[i].createdOn,
            isLeave: "No",
            categoryType: "Installation",
            details :[{}]
          }
          var job5 = {
            from: this.timesheetData[i].job5DistanceFrom,
            to: this.timesheetData[i].job5DistanceTo,
            kms: this.timesheetData[i].job5Kms,
            timespent: this.timesheetData[i].job5TimeSpent
          }
          
          this.totalKms += Number(this.timesheetData[i].job5Kms);
          this.totalTimespent += Number(this.timesheetData[i].job5TimeSpent);
          obj.details.push(job5);
         
      
          
      this.sheetDismantleData.push(obj);
        }
        if(this.timesheetData[i].adminOfficeAccounts == 'Yes'){
          var obj = {
            date : this.timesheetData[i].createdOn,
            isLeave: "No",
            categoryType: "Installation",
            details :[{}]
          }
          var job = {
            name: this.timesheetData[i].job1,
            workDesc: this.timesheetData[i].workDesc1 ? String(this.timesheetData[i].workDesc1).replace(/<[^>]+>/gm, '') : '',
            kms: this.timesheetData[i].job1Kms,
            timespent: this.timesheetData[i].job1TimeSpent
          }
          this.totalKms += Number(this.timesheetData[i].job1Kms);
          
          this.totalTimespent += Number(this.timesheetData[i].job1TimeSpent);

          obj.details.push(job);
          this.sheetDismantleData.push(obj);
         
      
        } 
      }
      if (this.timesheetData[i].leave == "Yes") {
        var obj = {
          date : this.timesheetData[i].createdOn,
          isLeave: "No",
          categoryType: "None",
          details :[{}]
        }
        const strippedString = this.timesheetData[i].leaveDetails.replace(/(<([^>]+)>)/gi, "");

        var leave ={
          typeOfLeave: this.timesheetData[i].leaveCategory,
          leaveDetails : strippedString,
          proof : this.timesheetData[i].leaveFileLink
        }
        obj.isLeave= this.timesheetData[i].leave;
        obj.details.push(leave);
        
      this.sheetDismantleData.push(obj);
      }


    }

    var kmsObj = {
      id : getPersonName,
      value: this.totalKms
    }
    console.log(this.sheetDismantleData);
    console.log(this.totalKms);
    this.totalKmsArr.push(kmsObj);
    console.log(this.totalKmsArr);
  }

  findMatchingValue(id: string): string | undefined {
    const item = this.totalKmsArr.find((obj: { id: string; }) => obj.id === id);
    return item ? item.value : 0;
  }

}
