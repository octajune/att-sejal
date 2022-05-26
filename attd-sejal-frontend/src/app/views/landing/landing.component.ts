import { Component, OnInit } from "@angular/core";
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
})
export class LandingComponent implements OnInit {
  basePath = environment.backendURL;
  filterName: string;
  constructor(private router :  Router, private http : HttpClient, private toastr : ToastrService) {}

  ngOnInit(): void {
    if (localStorage.getItem("token") != null && localStorage.getItem("email_id") != null && localStorage.getItem("user_type")  != null) {
      if (localStorage.getItem("user_type") === '1'){
        this.toastr.success("Logged in as : " + localStorage.getItem("email_id"));
        this.router.navigate(['admin/dashboard']);
      }
      else {
        this.router.navigate(['student/dashboard']);
      }
    }
  }

  submit_review(message) {
    let body = new FormData();
    const msg = message.value.filterName;
    body.append('msg', msg);
    if (msg == null || msg == '') {
      this.toastr.info("The review can't be left empty");
      return;
    }
    this.http.post<any>(this.basePath + 'submit_review', body).subscribe(data => {
      this.toastr.success("Comment submitted. Thank you so much! :)");
      this.filterName = '';
    }, error=>{
      this.toastr.error("Something went wrong with the backend");
      this.filterName = '';
    });
  }
}
