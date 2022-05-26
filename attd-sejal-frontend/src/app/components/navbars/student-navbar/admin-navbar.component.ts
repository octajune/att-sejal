import { Component, OnInit } from "@angular/core";
import {Router} from '@angular/router';

@Component({
  selector: "app-student-navbar",
  templateUrl: "./student-navbar.component.html",
})
export class StudentNavbarComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {

  }
}
