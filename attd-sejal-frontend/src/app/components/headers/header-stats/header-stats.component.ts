import { Component, OnInit } from "@angular/core";
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';

@Component({
  selector: "app-header-stats",
  templateUrl: "./header-stats.component.html",
})
export class HeaderStatsComponent implements OnInit {
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
      this.avgAttd = ''+((present/data.length)*100)+'%';
    }, error => {
      console.log(error);
      this.toastr.error(error.message);
    });
  }
}
