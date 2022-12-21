import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  constructor(private http: HttpClient) { }

  // rootURL = "http://localhost:3000/api/timesheet";
  rootURL = "https://awful-jade-kimono.cyclic.app";
  getAllHours()
  {
    return this.http.get(this.rootURL + '/get/all/personAssigned');
  }

  getAllRDOs()
  {
    return this.http.get(this.rootURL + '/get/all/rdo');
  }
  getAllAnnualLeave()
  {
    return this.http.get(this.rootURL + '/get/all/annualleave');
  }
  getAllUnpaidLeave()
  {
    return this.http.get(this.rootURL + '/get/all/unpaidleave');
  }
  getAllPublicHoliday()
  {
    return this.http.get(this.rootURL + '/get/all/publicholiday');
  }

  getAllPersonalCaresLeave()
  {
    return this.http.get(this.rootURL + '/get/all/personalAndCaresLeave');
  }

  getFilterHeadTimesheet(startDate: string, lastDate: string, name: string)
  {
    return this.http.get(this.rootURL + "/get/filter/head/timesheet?startDate=" + startDate + "&lastDate=" + lastDate + "&name=" + name);
  }
  getFilterTimesheet(startDate: string, lastDate: string, name: string)
  {
    return this.http.get(this.rootURL + "/get/filter/timesheet?startDate=" + startDate + "&lastDate=" + lastDate + "&name=" + name);
  }

  // FILTER BY START AND END ATE

  getFilterHomeTimesheet(startDate: string, lastDate: string)
  {
    return this.http.get(this.rootURL + "/get/filter/home/timesheet?startDate=" + startDate + "&lastDate=" + lastDate );
  }

}
