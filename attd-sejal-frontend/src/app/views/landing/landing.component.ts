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
    // Check if the localStorage values are valid, if yes then login directly
    if (localStorage.getItem("token") != null && localStorage.getItem("email_id") != null && localStorage.getItem("user_type")  != null) {
      if (localStorage.getItem("user_type") === '1'){
        // Load in the admin dashboard.
        this.toastr.success("Logged in as : " + localStorage.getItem("email_id"));
        this.router.navigate(['admin/dashboard']);
      }
      else {
        // Navigate to student dashboard.
        this.router.navigate(['student/dashboard']);
      }
    }
  }

  // Submits a review.
  submit_review(message) {
    // Generate the form data for the filter.
    let body = new FormData();
    const msg = message.value.filterName;
    body.append('msg', msg);
    // Checks if the review can be left empty
    if (msg == null || msg == '') {
      this.toastr.info("The review can't be left empty");
      return;
    }
    // Submit a review
    this.http.post<any>(this.basePath + 'submit_review', body).subscribe(data => {
      // Submits a new comment.
      this.toastr.success("Comment submitted. Thank you so much! :)");
      this.filterName = '';
    }, error=>{
      // Error message and resets the comment.
      this.toastr.error("Something went wrong with the backend");
      this.filterName = '';
    });
  }
}
