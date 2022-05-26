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
    const passwd_hash = Md5.hashStr(pass);
    const name = data.value.name;
    if (name == null || name.trim() == '') {
      this.toastr.info("Name can't be left empty");
      return;
    }
    const confirm_pass = data.value.c_password;
    if (confirm_pass !== pass) {
      this.toastr.error('Passwords don\'t match');
      return;
    }
    const image = this.webcamImage.imageAsBase64;
    if (image == null || image.trim() == '') {
      this.toastr.info("No Image provided");
      return;
    }
    const x = this.toastr.toastrConfig.timeOut;
    this.toastr.toastrConfig.timeOut = 500;
    this.toastr.info("Sending Data to our server", );
    this.toastr.toastrConfig.timeOut = x;
    let body = new FormData();
    body.append('email_id', email);
    body.append('passwd_hash', passwd_hash);
    body.append('name', name);
    body.append('image', image.replace(/^data:image\/png;base64,/, ''));

    const iamteacher = data.value.iamteacher;
    if (iamteacher) {
      this.http.post<any>(this.basePath + 'register_teacher', body).subscribe(
        res => {
          if (res.ERROR) {
            this.toastr.error(res.ERROR);
            this.loading = false;
          } else {
            localStorage.setItem('email_id', res.email_id);
            localStorage.setItem('token', res.token);
            localStorage.setItem('user_type', '1');
            this.loading = false;
            this.router.navigate(['/admin/dashboard']);
          }
        }, error => {
          console.log(error);
          this.toastr.error(error.message);
          this.loading = false;
        }
      );
    } else {
      this.http.post<any>(this.basePath + 'register_student', body).subscribe(
        res => {
          if (res.ERROR) {
            this.toastr.error(res.ERROR);
          } else {
            localStorage.setItem('email_id', res.email_id);
            localStorage.setItem('token', res.token);
            localStorage.setItem('user_type', '0');
            this.loading = false;
            this.router.navigate(['/student/dashboard']);
          }
        }, error => {
          console.log(error);
          this.loading = false;
          this.toastr.error(error.message);
        }
      );
    }
  }
}

