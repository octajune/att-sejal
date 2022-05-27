import { Component, OnInit } from "@angular/core";
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: "app-student",
  templateUrl: "./student.component.html",
})
export class StudentComponent implements OnInit {
  basePath = environment.backendURL;
  totalAttdReq: string;
  totalAttdPresent: string;
  totalAttdMissed: string;
  totalAttdPercent: string;

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) {}

  ngOnInit(): void {
    const body = new FormData();
    body.append("email_id", localStorage.getItem('email_id'));
    body.append("token", localStorage.getItem('token'));
    this.http.post<any>(this.basePath + 'get_student_stats', body).subscribe(data=>{
      if (!data.ERROR) {
        this.totalAttdPresent = data.present;
        this.totalAttdReq = data.total;
        this.totalAttdMissed = data.absent;
        //let num = Math.round(((data.present/data.length)*100) * 100) / 100
        if (data.total == '0')
          this.totalAttdPercent = 'No attendance requests';
        else{
          let num = Math.round(((data.present/data.length)*100) * 100) / 100;
          this.totalAttdPercent = ''+(100*(data.present/data.total)) + '%';
        
        }
        

        
      } else {
        this.toastr.error(data.ERROR);
      }
    }, error => {
      this.toastr.error(error.message);
    });
  }
}
