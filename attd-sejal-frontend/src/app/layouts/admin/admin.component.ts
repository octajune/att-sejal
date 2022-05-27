import { Component, OnInit } from "@angular/core";
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
})
export class AdminComponent implements OnInit {
  basePath = environment.backendURL;
  totalStudents: string;
  totalAttdPresent: string;
  totalAttdPending: string;
  avgAttd: string;
  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) {}

  ngOnInit(): void {
    const body = new FormData();
    body.append("email_id", localStorage.getItem('email_id'));
    body.append("token", localStorage.getItem('token'));
    this.http.post<any>(this.basePath + 'get_latest_class_by_teacher', body).subscribe(data=>{
      this.totalStudents = ''+data.length;
      var present = 0;
      for (var i=0; i<data.length; i++) {
        if (data[i].attendance_marked == 1) present++;
      }
      this.totalAttdPresent = ''+present;
      this.totalAttdPending = ''+(data.length - present);
      let num = Math.round(((present/data.length)*100) * 100) / 100
      this.avgAttd = ''+num+'%';
      if (data.length == '0')
          this.avgAttd = 'No attendance requests';
    }, error => {
      console.log(error);
      this.toastr.error(error.message);
    });
  }
}
