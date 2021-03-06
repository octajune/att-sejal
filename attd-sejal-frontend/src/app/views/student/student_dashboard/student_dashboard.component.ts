import {OnInit, Component, ElementRef, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../../environments/environment';
import Chart from "chart.js";
import {DatePipe} from '@angular/common';

@Component({
  selector: 'student_dashboard',
  templateUrl: './student_dashboard.component.html',
})
export class StudentDashboardComponent implements OnInit {
  basePath = environment.backendURL;
  attdTime: any = [];
  ngOnInit() {
    //If the user type is teacher then redirect them to the teacher dashboard
    if (localStorage.getItem("user_type") == '1')
      this.router.navigate(['admin/dashboard']);
  }
  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService, private datepipe: DatePipe) {}

  ngAfterViewInit() {
    // Generates a form data for the email.
    const body = new FormData();
    body.append('email_id', localStorage.getItem('email_id'));
    body.append('token', localStorage.getItem('token'));
    // Get student s attribute stats.
    this.http.post<any>(this.basePath + 'get_student_class_attd_stat', body).subscribe(data => {
     console.log(data);
      if (!data.ERROR) {
        // Writes data to the line.
        this.line(data);
        // Format the data into human readable format and add to attdTime, which will be displayed in HTML
        for (let i=0; i<data.length; i++) {
          this.attdTime.push({class_name: data[i].class_name, class_date: this.datepipe.transform(data[i].class_date, 'MMMM d, y'), marked_desc: data[i].marked == 0 ? 'Absent' : 'Attendance Marked'});
        }
      } else {
        // Toastr. error
        this.toastr.error(data.ERROR);
      }
    }, error => {
      // Error message.
      this.toastr.error(error.message);
    });
  }
  
  // Creates a line chart
  line(data){
    // Computes the labels, presenta and absent values from data.
    let labels = [];
    let present = [];
    for (let i=0; i<data.length; i++) {
      labels.push(data[i].class_name+' | '+this.datepipe.transform(data[i].class_date, 'MMMM d, y'));
      present.push(data[i].marked);
    }

    //Config file for the line chart
    var config = {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Present",
            fill: false,
            backgroundColor: "#fff",
            borderColor: "#fff",
            data: present,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          text: "Attd Chart",
          fontColor: "white",
        },
        legend: {
          labels: {
            fontColor: "white",
          },
          align: "end",
          position: "bottom",
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                fontColor: "rgba(255,255,255,.7)",
              },
              display: false,
              scaleLabel: {
                display: false,
                labelString: "Month",
                fontColor: "white",
              },
              gridLines: {
                display: false,
                borderDash: [2],
                borderDashOffset: [2],
                color: "rgba(33, 37, 41, 0.3)",
                zeroLineColor: "rgba(0, 0, 0, 0)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                fontColor: "rgba(255,255,255,.7)",
              },
              display: false,
              scaleLabel: {
                display: false,
                labelString: "Value",
                fontColor: "white",
              },
              gridLines: {
                borderDash: [3],
                borderDashOffset: [3],
                drawBorder: false,
                color: "rgba(255, 255, 255, 0.15)",
                zeroLineColor: "rgba(33, 37, 41, 0)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
        },
      },
    };
    // Creates a new chart.
    let ctx: any = document.getElementById("line-chart") as HTMLCanvasElement;
    ctx = ctx.getContext("2d");
    new Chart(ctx, config);
  }
}

