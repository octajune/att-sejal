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
    // Navigate to the student dashboard if the user is a student
    if (localStorage.getItem("user_type") == '0')
      this.router.navigate(['student/dashboard']);
    // Generates a form data for the email.
    let body = new FormData();
    body.append("email_id", localStorage.getItem('email_id'));
    body.append("token", localStorage.getItem('token'));
    // Get classes by teacher
    this.http.post<any>(this.basePath + 'get_classes_by_teacher', body).subscribe(data=>{
      // Sets the data of the class.
      this.data = data;
      for (var i = 0; i < data.length; i++){
        // Adds a class title to the list of class titles.
        var attd = data[i]
        let title = this.getClassTitle(attd);
        this.class_titles.add(title);
        this.data[i]['title'] = title;
      }
    }, error => {
      // Error message.
      this.toastr.error(error.message);
    });
  }

  // Returns the class title for the given attribute.
  getClassTitle(attd): string {
    return attd['class_name'] + " - " + this.datepipe.transform(attd['class_date'], 'MMMM d, y');
  }
}
