import {OnInit, Component, ElementRef, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../../environments/environment';
import {WebcamImage} from 'ngx-webcam';
import {Observable, Subject} from 'rxjs';
import {start} from '@popperjs/core';

@Component({
  selector: 'mark-attd',
  templateUrl: './mark_attendance.component.html',
})
export class MarkAttendanceComponent implements OnInit {
  public webcamImage: WebcamImage = null;
  private trigger: Subject<void> = new Subject<void>();

  triggerSnapshot(): void {
    this.trigger.next();
  }

  ngOnInit() {
    if (localStorage.getItem("user_type") == '1')
      this.router.navigate(['admin/dashboard']);
  }

  handleImage(webcamImage: WebcamImage): void {
    console.info('Saved webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  basePath = environment.backendURL;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
  }

  onSubmit(data) {
    this.triggerSnapshot();
    console.log(data);
    const class_name = data.value.class_name;
    if (class_name == null || class_name.trim() == '') {
      this.toastr.info("Class Name can't be left empty");
      return;
    }
    const start_time = data.value.start_time;
    if (start_time == null || start_time.trim() == '') {
      this.toastr.info("Start Time can't be left empty");
      return;
    }
    const end_time = data.value.end_time;
    if (end_time == null || end_time.trim() == '') {
      this.toastr.info("End Time can't be left empty");
      return;
    }
    const class_date = data.value.class_date;
    if (class_date == null || class_date.trim() == '') {
      this.toastr.info("Class Date can't be left empty");
      return;
    }
    const image = this.webcamImage.imageAsBase64;
    if (image == null || image.trim() == '') {
      this.toastr.info("No Image provided");
      return;
    }

    if (data.value.end_time < data.value.start_time) {
      this.toastr.info("End Time can't be before Start Time");
      return;
    }
    const body = new FormData();
    body.append('class_name', class_name);
    body.append('class_date', class_date);
    body.append('start_time', start_time);
    body.append('end_time', end_time);
    body.append('image', image);
    body.append('token', localStorage.getItem('token'));
    body.append('email_id', localStorage.getItem('email_id'));
    console.log(body);
    this.http.post<any>(this.basePath + 'mark_attendance', body).subscribe(data => {
      if (data.ERROR) {
        this.toastr.error(data.ERROR);
        this.router.navigate(['/student/mark_attendance']);
      } else {
        this.toastr.success('Attendance Marked Successfully!');
        this.router.navigate(['/student/dashboard']);
      }
    }, error => {
      this.toastr.error(error.message);
    });
  }
}

