import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  constructor(private http: HttpClient) { }

  // rootURL = "http://localhost:3000/api/timesheet";
  rootURL = "https://awful-jade-kimono.cyclic.app/api/timesheet";

  getAllHours(startDate: string, lastDate: string)
  {
    return this.http.get(this.rootURL + "/get/all/personAssigned?startDate=" + startDate + "&lastDate=" + lastDate);
  }

  getAllRDOs(startDate: string, lastDate: string)
  {
    return this.http.get(this.rootURL + "/get/all/rdo?startDate=" + startDate + "&lastDate=" + lastDate);
  }
  getAllAnnualLeave(startDate: string, lastDate: string)
  {
    return this.http.get(this.rootURL + "/get/all/annualleave?startDate=" + startDate + "&lastDate=" + lastDate);
  }
  getAllUnpaidLeave(startDate: string, lastDate: string)
  {
    return this.http.get(this.rootURL + "/get/all/unpaidleave?startDate=" + startDate + "&lastDate=" + lastDate);
  }
  getAllPublicHoliday(startDate: string, lastDate: string)
  {
    return this.http.get(this.rootURL + "/get/all/publicholiday?startDate=" + startDate + "&lastDate=" + lastDate);
  }

  getAllPersonalCaresLeave(startDate: string, lastDate: string)
  {
    return this.http.get(this.rootURL + "/get/all/personalAndCaresLeave?startDate=" + startDate + "&lastDate=" + lastDate);
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
