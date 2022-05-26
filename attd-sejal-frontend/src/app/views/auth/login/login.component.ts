import { Component, OnInit } from "@angular/core";
import {HttpClient} from '@angular/common/http';
import {Md5} from 'ts-md5/dist/md5';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../../environments/environment';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})

export class LoginComponent implements OnInit {
  basePath = environment.backendURL;
  constructor(private http : HttpClient, private router :  Router, private toastr : ToastrService) {}
  ngOnInit(): void {
    //if value already exists in localStorage then redirect to dashboard right away
  }

  onSubmit(data): void {
    const email = data.value.email;
    if (email == null || email.trim() == '') {
      this.toastr.info("Email can't be left empty");
      return;
    }
    const pass = data.value.password;
    if (pass == null || pass.trim() == '') {
      this.toastr.info("Password can't be left empty");
      return;
    }
    const iamteacher = data.value.iamteacher;
    console.log(data.value);
    const passwd_hash = Md5.hashStr(pass);
    console.log(passwd_hash);
    let body = new FormData();
    body.append('email_id', email);
    body.append('passwd_hash', passwd_hash);
    const x = this.toastr.toastrConfig.timeOut;
    this.toastr.toastrConfig.timeOut = 500;
    this.toastr.info("Sending Data to our server", );
    this.toastr.toastrConfig.timeOut = x;
    if (iamteacher) {
      this.http.post<any>(this.basePath + 'login_teacher', body).subscribe(data => {
        if (!data.ERROR) {
          localStorage.setItem("email_id", data.email_id);
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_type", '1');
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.toastr.error(data.ERROR);
        }
      }, error => {
        console.log(error);
        this.toastr.error(error.message);
      });
    } else {
      this.http.post<any>(this.basePath + 'login_student', body).subscribe(data => {
        if (!data.ERROR) {
          localStorage.setItem("email_id", data.email_id);
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_type", '0');
          this.router.navigate(['/student/dashboard']);
        } else {
          this.toastr.error(data.ERROR);
        }
      }, error => {
        console.log(error);
        this.toastr.error(error.message);
      });
    }
  }
}
