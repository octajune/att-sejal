import { Component, OnInit } from "@angular/core";

@Component({
  selector: "student-sidebar",
  templateUrl: "./student_sidebar.component.html",
})
export class StudentSidebarComponent implements OnInit {
  collapseShow = "hidden";
  constructor() {}

  ngOnInit() {}
  toggleCollapseShow(classes) {
    this.collapseShow = classes;
  }
}
