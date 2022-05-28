import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'create-class',
  templateUrl: './create_class.component.html',
})
export class CreateClassComponent implements OnInit {
  basePath = environment.backendURL;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
  }

  ngOnInit() {
    //If its a student account then redirect them to student/dashboard
    if (localStorage.getItem("user_type") == '0')
      this.router.navigate(['student/dashboard']);
  }

  onSubmit(data) {
    //Input validation
    // Checks if a class can be found.
    const class_name = data.value.class_name;
    if (class_name == null || class_name.trim() == '') {
      this.toastr.info('Class Name can\'t be left empty');
      return;
    }
    // Checks if the class date is valid.
    const class_date = data.value.class_date;
    if (class_date == null || class_date.trim() == '') {
      this.toastr.info('Class Date can\'t be left empty');
      return;
    }
    // Checks if the start time is a valid start time
    const start_time = data.value.start_time;
    if (start_time == null || start_time.trim() == '') {
      this.toastr.info('Start Time can\'t be left empty');
      return;
    }
    // Checks if the end time is empty.
    const end_time = data.value.end_time;
    if (end_time == null || end_time.trim() == '') {
      this.toastr.info('End Time can\'t be left empty');
      return;
    }
    // Provide student email ids
    const student_email_ids = data.value.student_email_ids;
    if (student_email_ids == null || student_email_ids.trim() == '') {
      this.toastr.info('No Student email Ids provided');
      return;
    }


    // Returns a form data object containing the form data.
    const body = new FormData();
    body.append('class_name', class_name);
    body.append('class_date', class_date);
    body.append('start_time', start_time);
    body.append('end_time', end_time);
    body.append('token', localStorage.getItem('token'));
    body.append('email_id', localStorage.getItem('email_id'));
    body.append('student_email_ids', student_email_ids);
    // Creates a class.
    this.http.post<any>(this.basePath + 'create_class', body).subscribe(data => {
      if (data.ERROR) {
        // Navigates to the admin.
        this.toastr.error(data.ERROR);
        this.router.navigate(['/admin/create_class']);
      } else {
        // Navigates to the dashboard.
        this.toastr.success('Class Created Succesfully!');
        this.router.navigate(['/admin/dashboard']);
      }
    }, error => {
      // Error message.
      this.toastr.error(error.message);
    });
  }
}
