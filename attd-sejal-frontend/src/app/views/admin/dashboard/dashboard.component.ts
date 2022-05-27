import { Component, OnInit } from "@angular/core";
import {Router} from '@angular/router';
import Chart from "chart.js";
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {ToastrService} from 'ngx-toastr';
import {DatePipe} from '@angular/common';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnInit {
  basePath = environment.backendURL;
  attdTime:any = [];
  studentPercentage:any = [];
  constructor(private router :  Router, private http: HttpClient, private toastr: ToastrService, private datepipe: DatePipe) {}

  ngOnInit() {
    if (localStorage.getItem("user_type") == '0')
      this.router.navigate(['student/dashboard']);
  }

  bar(data){
    const labels = [];
    const present = [];
    const absent = [];
    for (let i in data) {
      labels.push(i);
      present.push(data[i].present);
      absent.push(data[i].total - data[i].present);
    }
    let config = {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Present Students',
            backgroundColor: "#ed64a6",
            borderColor: "#ed64a6",
            data: present,
            fill: false,
            barThickness: 8,
          },
          {
            label: 'Absent Student',
            fill: false,
            backgroundColor: "#4c51bf",
            borderColor: "#4c51bf",
            data: absent,
            barThickness: 8,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          text: "Class Turnaround",
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        legend: {
          labels: {
            fontColor: "rgba(0,0,0,.4)",
          },
          align: "end",
          position: "bottom",
        },
        scales: {
          xAxes: [
            {
              display: false,
              scaleLabel: {
                display: false,
                labelString: "Class Name",
              },
              gridLines: {
                borderDash: [2],
                borderDashOffset: [2],
                color: "rgba(33, 37, 41, 0.3)",
                zeroLineColor: "rgba(33, 37, 41, 0.3)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Value",
              },
              gridLines: {
                borderDash: [2],
                drawBorder: false,
                borderDashOffset: [2],
                color: "rgba(33, 37, 41, 0.2)",
                zeroLineColor: "rgba(33, 37, 41, 0.15)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
        },
      },
    };
    let ctx: any = document.getElementById("bar-chart");
    ctx = ctx.getContext("2d");
    new Chart(ctx, config);
  }
  line(data){
    console.log(data)
    const labels = [];
    const present = [];
    const total = [];
    for (let i in data) {
      console.log(i);
      labels.push(i);
      present.push(data[i].present);
      total.push(data[i].total-data[i].present);
    }

    var config = {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Present",
            backgroundColor: "#4c51bf",
            borderColor: "#4c51bf",
            data: present,
            fill: false,
          },
          {
            label: "Absent",
            fill: false,
            backgroundColor: "#fff",
            borderColor: "#fff",
            data: total,
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
    let ctx: any = document.getElementById("line-chart") as HTMLCanvasElement;
    ctx = ctx.getContext("2d");
    new Chart(ctx, config);
  }

  ngAfterViewInit() {
    const body = new FormData();
    body.append('email_id', localStorage.getItem('email_id'));
    body.append('token', localStorage.getItem('token'));
    this.http.post<any>(this.basePath + 'get_present_absent_classes_by_teacher', body).subscribe(data => {
      if (!data.ERROR) {
        this.line(data);
        this.bar(data);
      } else {
        this.toastr.error(data.ERROR);
      }
    }, error => {
      console.log(error);
      this.toastr.error(error.message);
    });
    this.http.post<any>(this.basePath + 'get_attendance_time_records', body).subscribe(data=>{
      console.log(data)
      if (!data.ERROR) {
        for (let i=0; i<data.length; i++) {
          this.attdTime[i] = {'email_id': data[i].email_id, 'time': this.datepipe.transform(data[i].time, "hh:mm a, MMM d, y")};
        }
      } else {
        this.toastr.error(data.ERROR);
      }
    }, error => {
      console.log(error);
      this.toastr.error(error.message);
    });
    this.http.post<any>(this.basePath + 'get_student_class_record', body).subscribe(data=>{
      console.log(data)
      if (!data.ERROR) {
        for (let key in data) {
          console.log(data);
          let email_id = key.split('|')[0];
          let class_name = key.split('|')[1];
          let present = data[key].present;
          let absent = data[key].absent;
          let total = data[key].total;
          this.studentPercentage.push({email_id: email_id.trim(), class_name: class_name.trim(), present: present, total: total})
        }
      } else {
        this.toastr.error(data.ERROR);
      }
    }, error => {
      console.log(error);
      this.toastr.error(error.message);
    });
  }
}
