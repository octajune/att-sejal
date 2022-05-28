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
  ngOnInit(): void {}

  onSubmit(data): void {
    // Email can't be empty
    const email = data.value.email;
    if (email == null || email.trim() == '') {
      this.toastr.info("Email can't be left empty");
      return;
    }
    // Password can't be empty
    const pass = data.value.password;
    if (pass == null || pass.trim() == '') {
      this.toastr.info("Password can't be left empty");
      return;
    }
    const iamteacher = data.value.iamteacher;
    const passwd_hash = Md5.hashStr(pass);
    // Generates a form data for the email.
    let body = new FormData();
    body.append('email_id', email);
    body.append('passwd_hash', passwd_hash);
    const x = this.toastr.toastrConfig.timeOut;
    // Send data to our server
    this.toastr.toastrConfig.timeOut = 500;
    this.toastr.info("Sending Data to our server", );
    this.toastr.toastrConfig.timeOut = x;
    if (iamteacher) {
      // Create a new login teacher.
      this.http.post<any>(this.basePath + 'login_teacher', body).subscribe(data => {
        if (!data.ERROR) {
          // Sets localStorage s settings
          localStorage.setItem("email_id", data.email_id);
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_type", '1');
          // Navigate to the dashboard.
          this.router.navigate(['/admin/dashboard']);
        } else {
          // Toastr. error
          this.toastr.error(data.ERROR);
        }
      }, error => {
        // Error message.
        this.toastr.error(error.message);
      });
    } else {
      // Logs in a student.
      this.http.post<any>(this.basePath + 'login_student', body).subscribe(data => {
        if (!data.ERROR) {
          // Sets localStorage.
          localStorage.setItem("email_id", data.email_id);
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_type", '0');
          // Navigate to the student dashboard.
          this.router.navigate(['/student/dashboard']);
        } else {
          // Toastr. error
          this.toastr.error(data.ERROR);
        }
      }, error => {
        // Error message.
        this.toastr.error(error.message);
      });
    }
  }
}
