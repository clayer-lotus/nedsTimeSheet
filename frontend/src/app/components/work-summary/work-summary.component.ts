import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TimesheetService } from 'src/app/services/timesheet/timesheet.service';

@Component({
  selector: 'app-work-summary',
  templateUrl: './work-summary.component.html',
  styleUrls: ['./work-summary.component.css']
})
export class WorkSummaryComponent implements OnInit {

  personName !: string;
  from !: string;
  to !: string;
  timesheetData: any = [];
  headTimesheetData: any = [];
  sheetDismantleData: any = [];
  totalKms: number = 0;
  totalTimespent: number = 0;

  
  dataRDOs: any = [];
  dataAnnualLeave: any = [];
  dataUnpaidLeave: any = [];
  dataPublicHoliday: any = [];
  dataPersonalCaresLeave: any = [];

  constructor(private route: ActivatedRoute, private _timesheet: TimesheetService) {

  }

  ngOnInit(): void {

    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.personName = params['name'];
        this.from = params['from'];
        this.to = params['to'];
      }
      );

    this.getFilterTimesheetFunc();
    this.getFilterHeadTimesheetFunc();
  }

  getFilterTimesheetFunc() {
    this._timesheet.getFilterTimesheet(this.from, this.to, this.personName).subscribe(
      res => {
        this.timesheetData = res;
        console.log(this.timesheetData);
        this.dismantleData();
      },
      err => {

      }
    )
  }

  getFilterHeadTimesheetFunc() {
    this._timesheet.getFilterHeadTimesheet(this.from, this.to, this.personName).subscribe(
      res => {
        this.headTimesheetData = res;
        console.log(this.headTimesheetData);

        for(var i=0;i<this.headTimesheetData.length ;i++)
        {
          this.headTimesheetData[i].rdoHours = 0;
          this.headTimesheetData[i].unpaidleave = 0;
          this.headTimesheetData[i].publicHoliday =0;
          this.headTimesheetData[i].annualleave = 0;
          this.headTimesheetData[i].personalAndCares =0;
          
          this.headTimesheetData[i].tripleTime =0;
        }

         // GET ALL RDOS
         this._timesheet.getAllRDOs().subscribe(
          res => {
            this.dataRDOs = res;
            for (var i = 0; i < this.dataRDOs.length; i++) {
              for (var j = 0; j < this.headTimesheetData.length; j++) {

                if (this.dataRDOs[i]._id == this.headTimesheetData[j]._id) {
                  this.headTimesheetData[j].rdoHours = this.dataRDOs[i].rdoHours;
                }
              }

            }
          },
          err => {

          }
        )
        // GET ALL ANNUUAL Leave
        this._timesheet.getAllAnnualLeave().subscribe(
          res => {
            this.dataAnnualLeave = res;
            for (var i = 0; i < this.dataAnnualLeave.length; i++) {
              for (var j = 0; j < this.headTimesheetData.length; j++) {
                if (this.dataAnnualLeave[i]._id == this.headTimesheetData[j]._id) {
                  this.headTimesheetData[j].annualleave = this.dataAnnualLeave[i].total * 7.2;
                }
               
              }

            }
          },
          err => {

          }
        )

        // GET ALL UNPAID Leave
        this._timesheet.getAllUnpaidLeave().subscribe(
          res => {
            this.dataUnpaidLeave = res;

            for (var i = 0; i < this.dataUnpaidLeave.length; i++) {
              for (var j = 0; j < this.headTimesheetData.length; j++) {
                if (this.dataUnpaidLeave[i]._id == this.headTimesheetData[j]._id) {
                  this.headTimesheetData[j].unpaidleave = this.dataUnpaidLeave[i].total * 7.2;
                }
                
              }

            }
          },
          err => {

          }
        )

        // GET ALL PUBLIC HOLDIAY 
        this._timesheet.getAllPublicHoliday().subscribe(
          res => {
            this.dataPublicHoliday = res;
            for (var i = 0; i < this.dataPublicHoliday.length; i++) {
              for (var j = 0; j < this.headTimesheetData.length; j++) {
                if (this.dataPublicHoliday[i]._id == this.headTimesheetData[j]._id) {
                  this.headTimesheetData[j].publicHoliday = this.dataPublicHoliday[i].total * 7.2;
                  this.headTimesheetData[j].tripleTime = this.dataPublicHoliday[i].total * 7.0;
               
                }
               
              }

            }
          },
          err => {

          }
        )

        // GET ALL PERSONAL/CARES LEAVE
        this._timesheet.getAllPersonalCaresLeave().subscribe(
          res => {
            this.dataPersonalCaresLeave = res;
            for (var i = 0; i < this.dataPersonalCaresLeave.length; i++) {
              for (var j = 0; j < this.headTimesheetData.length; j++) {
                if (this.dataPersonalCaresLeave[i]._id == this.headTimesheetData[j]._id) {
                  this.headTimesheetData[j].personalAndCares = this.dataPersonalCaresLeave[i].total * 7.2;
                  console.log(this.headTimesheetData[j].personalAndCares);

                }
           
              }

            }
          },
          err => {

          }
        )
      },
      err => {

      }
    )
  }

  dismantleData() {

    for (var i = 0; i < this.timesheetData.length; i++) {
      
      if (this.timesheetData[i].leave == "No") {
        if (this.timesheetData[i].job1DistanceFrom != '' && this.timesheetData[i].job1DistanceTo != '') {

          var obj = {
            date : this.timesheetData[i].createdOn,
            isLeave: "No",
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
        if (this.timesheetData[i].job2DistanceFrom != '' && this.timesheetData[i].job2DistanceTo != '') {
          var obj = {
            date : this.timesheetData[i].createdOn,
            isLeave: "No",
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
        if (this.timesheetData[i].job3DistanceFrom != '' && this.timesheetData[i].job3DistanceTo != '') {
          var obj = {
            date : this.timesheetData[i].createdOn,
            isLeave: "No",
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
        if (this.timesheetData[i].job4DistanceFrom != '' && this.timesheetData[i].job4DistanceTo != '') {
          var obj = {
            date : this.timesheetData[i].createdOn,
            isLeave: "No",
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
        if (this.timesheetData[i].job5DistanceFrom != '' && this.timesheetData[i].job5DistanceTo != '') {
          var obj = {
            date : this.timesheetData[i].createdOn,
            isLeave: "No",
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
      }
      if (this.timesheetData[i].leave == "Yes") {
        var obj = {
          date : this.timesheetData[i].createdOn,
          isLeave: "No",
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
    console.log(this.sheetDismantleData);
  }

}
