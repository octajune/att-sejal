import { Component, OnInit } from "@angular/core";
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {DatePipe} from '@angular/common';
import {environment} from '../../../../environments/environment';

@Component({
  selector: "app-tables",
  templateUrl: "./tables.component.html",
})
export class TablesComponent implements OnInit {
  basePath = environment.backendURL;
  constructor(private http : HttpClient, private router :  Router, private toastr : ToastrService, public datepipe: DatePipe) {}
  color: string = "light";
  data:any = [];
  class_titles = new Set();
  student_records = new Map<string, Array<any>>();
  ngOnInit(): void {
    if (localStorage.getItem("user_type") == '0')
      this.router.navigate(['student/dashboard']);
    let body = new FormData();
    body.append("email_id", localStorage.getItem('email_id'));
    body.append("token", localStorage.getItem('token'));
    this.http.post<any>(this.basePath + 'get_classes_by_teacher', body).subscribe(data=>{
      this.data = data;
      //let class_titles = new Set();
      for (var i = 0; i < data.length; i++){
        var attd = data[i]
        let title = this.getClassTitle(attd);
        this.class_titles.add(title);
        this.data[i]['title'] = title;
      }
    }, error => {
      console.log(error);
      this.toastr.error(error.message);
    });
  }

  getClassTitle(attd): string {
    return attd['class_name'] + " - " + this.datepipe.transform(attd['class_date'], 'MMMM d, y') + " (" +
      this.datepipe.transform(attd['start_time'], 'h:MM a') + " - " + this.datepipe.transform(attd['end_time'], 'h:MM a') + ")";
  }
  /*
  [
    {
        "attendance_marked": 0,
        "class_date": "Sat, 21 May 2022 00:00:00 GMT",
        "class_name": "COP4601",
        "create_datetime": "Sat, 21 May 2022 22:25:07 GMT",
        "end_time": "Sun, 22 May 2022 22:24:48 GMT",
        "id": 8,
        "marked_time": null,
        "start_time": "Sun, 22 May 2022 21:24:57 GMT",
        "student_email_id": "d@e.com",
        "teacher_email_id": "kshashwat@usf.edu"
    },
    {
        "attendance_marked": 0,
        "class_date": "Sat, 21 May 2022 00:00:00 GMT",
        "class_name": "COP4601",
        "create_datetime": "Sat, 21 May 2022 22:25:07 GMT",
        "end_time": "Sun, 22 May 2022 22:24:48 GMT",
        "id": 5,
        "marked_time": null,
        "start_time": "Sun, 22 May 2022 21:24:57 GMT",
        "student_email_id": "a@b.com",
        "teacher_email_id": "kshashwat@usf.edu"
    },
    {
        "attendance_marked": 0,
        "class_date": "Sat, 21 May 2022 00:00:00 GMT",
        "class_name": "COP4601",
        "create_datetime": "Sat, 21 May 2022 22:25:07 GMT",
        "end_time": "Sun, 22 May 2022 22:24:48 GMT",
        "id": 6,
        "marked_time": null,
        "start_time": "Sun, 22 May 2022 21:24:57 GMT",
        "student_email_id": "b@c.com",
        "teacher_email_id": "kshashwat@usf.edu"
    },
    {
        "attendance_marked": 0,
        "class_date": "Sat, 21 May 2022 00:00:00 GMT",
        "class_name": "COP4601",
        "create_datetime": "Sat, 21 May 2022 22:25:07 GMT",
        "end_time": "Sun, 22 May 2022 22:24:48 GMT",
        "id": 7,
        "marked_time": null,
        "start_time": "Sun, 22 May 2022 21:24:57 GMT",
        "student_email_id": "c@d.com",
        "teacher_email_id": "kshashwat@usf.edu"
    },
    {
        "attendance_marked": 0,
        "class_date": "Sat, 21 May 2022 00:00:00 GMT",
        "class_name": "COP4600",
        "create_datetime": "Sat, 21 May 2022 22:25:07 GMT",
        "end_time": "Sat, 21 May 2022 22:24:48 GMT",
        "id": 1,
        "marked_time": null,
        "start_time": "Sat, 21 May 2022 21:24:57 GMT",
        "student_email_id": "a@b.com",
        "teacher_email_id": "kshashwat@usf.edu"
    },
    {
        "attendance_marked": 0,
        "class_date": "Sat, 21 May 2022 00:00:00 GMT",
        "class_name": "COP4600",
        "create_datetime": "Sat, 21 May 2022 22:25:07 GMT",
        "end_time": "Sat, 21 May 2022 22:24:48 GMT",
        "id": 2,
        "marked_time": null,
        "start_time": "Sat, 21 May 2022 21:24:57 GMT",
        "student_email_id": "b@c.com",
        "teacher_email_id": "kshashwat@usf.edu"
    },
    {
        "attendance_marked": 0,
        "class_date": "Sat, 21 May 2022 00:00:00 GMT",
        "class_name": "COP4600",
        "create_datetime": "Sat, 21 May 2022 22:25:07 GMT",
        "end_time": "Sat, 21 May 2022 22:24:48 GMT",
        "id": 3,
        "marked_time": null,
        "start_time": "Sat, 21 May 2022 21:24:57 GMT",
        "student_email_id": "c@d.com",
        "teacher_email_id": "kshashwat@usf.edu"
    },
    {
        "attendance_marked": 0,
        "class_date": "Sat, 21 May 2022 00:00:00 GMT",
        "class_name": "COP4600",
        "create_datetime": "Sat, 21 May 2022 22:25:07 GMT",
        "end_time": "Sat, 21 May 2022 22:24:48 GMT",
        "id": 4,
        "marked_time": null,
        "start_time": "Sat, 21 May 2022 21:24:57 GMT",
        "student_email_id": "d@e.com",
        "teacher_email_id": "kshashwat@usf.edu"
    }
]
  * */
}
