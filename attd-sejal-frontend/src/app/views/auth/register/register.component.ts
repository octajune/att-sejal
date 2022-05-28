import {OnInit, Component, ElementRef, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Md5} from 'ts-md5';
import {environment} from '../../../../environments/environment';
import {Observable, Subject} from 'rxjs';
import {WebcamImage} from 'ngx-webcam';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  public webcamImage: WebcamImage = null;
  private trigger: Subject<void> = new Subject<void>();

  triggerSnapshot(): void {
    this.trigger.next();
  }

  ngOnInit() {}

  handleImage(webcamImage: WebcamImage): void {
    console.info('Saved webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  basePath = environment.backendURL;
  loading: boolean;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
  }

  onSubmit(data) {
    this.triggerSnapshot();
    this.loading = true;
    console.log(data);
    // Email can t be empty
    const email = data.value.email;
    if (email == null || email.trim() == '') {
      this.toastr.info("Email can't be left empty");
      return;
    }
    // Password can t be empty
    const pass = data.value.password;
    if (pass == null || pass.trim() == '') {
      this.toastr.info("Password can't be left empty");
      return;
    }
    // Checks if a name can be used
    const passwd_hash = Md5.hashStr(pass);
    const name = data.value.name;
    if (name == null || name.trim() == '') {
      this.toastr.info("Name can't be left empty");
      return;
    }
    // Confirms a password.
    const confirm_pass = data.value.c_password;
    if (confirm_pass !== pass) {
      this.toastr.error('Passwords don\'t match');
      return;
    }
    // Returns the image as base64.
    const image = this.webcamImage.imageAsBase64;
    if (image == null || image.trim() == '') {
      this.toastr.info("No Image provided");
      return;
    }
    const x = this.toastr.toastrConfig.timeOut;
    this.toastr.toastrConfig.timeOut = 500;
    this.toastr.info("Sending Data to our server", );
    this.toastr.toastrConfig.timeOut = x;
    // Generate the form data.
    let body = new FormData();
    body.append('email_id', email);
    body.append('passwd_hash', passwd_hash);
    body.append('name', name);
    body.append('image', image.replace(/^data:image\/png;base64,/, ''));

    const iamteacher = data.value.iamteacher;
    if (iamteacher) {
      // Register a teacher
      this.http.post<any>(this.basePath + 'register_teacher', body).subscribe(
        res => {
          if (res.ERROR) {
            // Error message from toastr.
            this.toastr.error(res.ERROR);
            this.loading = false;
          } else {
            // Sets localStorage.
            localStorage.setItem('email_id', res.email_id);
            localStorage.setItem('token', res.token);
            localStorage.setItem('user_type', '1');
            // Sets the loading flag to false.
            this.loading = false;
            // Navigate to the dashboard.
            this.router.navigate(['/admin/dashboard']);
          }
        }, error => {
          // Error message.
          this.toastr.error(error.message);
          // Sets the loading flag to false.
          this.loading = false;
        }
      );
    } else {
      // Register a student
      this.http.post<any>(this.basePath + 'register_student', body).subscribe(
        res => {
          if (res.ERROR) {
            // Error message from toastr.
            this.toastr.error(res.ERROR);
          } else {
            // Sets localStorage.
            localStorage.setItem('email_id', res.email_id);
            localStorage.setItem('token', res.token);
            localStorage.setItem('user_type', '0');
            // Sets the loading flag to false.
            this.loading = false;
            // Navigate to the student dashboard.
            this.router.navigate(['/student/dashboard']);
          }
        }, error => {
          // Sets the loading flag to false.
          this.loading = false;
          // Error message.
          this.toastr.error(error.message);
        }
      );
    }
  }
}

