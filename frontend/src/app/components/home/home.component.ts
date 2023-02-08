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
  startDate !: string;
  endDate !: string;
  // dataTripleTime: any = [];
  dataPersonalCaresLeave: any = [];

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

    
    this.setDefaultStartAndEndDate();
    this.getAllByHours();

  }

  setDefaultStartAndEndDate() {
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

    this._timesheet.getFilterHomeTimesheet(this.startDate, this.endDate).subscribe(
      res => {
        console.log(res);
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
        this._timesheet.getAllRDOs().subscribe(
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
        this._timesheet.getAllAnnualLeave().subscribe(
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
        this._timesheet.getAllUnpaidLeave().subscribe(
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
        this._timesheet.getAllPublicHoliday().subscribe(
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
        this._timesheet.getAllPersonalCaresLeave().subscribe(
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
        this._timesheet.getAllRDOs().subscribe(
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
        this._timesheet.getAllAnnualLeave().subscribe(
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
        this._timesheet.getAllUnpaidLeave().subscribe(
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
        this._timesheet.getAllPublicHoliday().subscribe(
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
        this._timesheet.getAllPersonalCaresLeave().subscribe(
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
        this._timesheet.getAllRDOs().subscribe(
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
        this._timesheet.getAllAnnualLeave().subscribe(
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
        this._timesheet.getAllUnpaidLeave().subscribe(
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
        this._timesheet.getAllPublicHoliday().subscribe(
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
        this._timesheet.getAllPersonalCaresLeave().subscribe(
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

}
