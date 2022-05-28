import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

// layouts
import { AdminComponent } from "./layouts/admin/admin.component";
import { AuthComponent } from "./layouts/auth/auth.component";

// admin views
import { DashboardComponent } from "./views/admin/dashboard/dashboard.component";
import { TablesComponent } from "./views/admin/tables/tables.component";

// auth views
import { LoginComponent } from "./views/auth/login/login.component";
import { RegisterComponent } from "./views/auth/register/register.component";

// no layouts views
import { LandingComponent } from "./views/landing/landing.component";

// components for views and layouts

import { AdminNavbarComponent } from "./components/navbars/admin-navbar/admin-navbar.component";
import { AuthNavbarComponent } from "./components/navbars/auth-navbar/auth-navbar.component";
import { FooterAdminComponent } from "./components/footers/footer-admin/footer-admin.component";
import { FooterComponent } from "./components/footers/footer/footer.component";
import { FooterSmallComponent } from "./components/footers/footer-small/footer-small.component";
import { HeaderStatsComponent } from "./components/headers/header-stats/header-stats.component";
import { IndexNavbarComponent } from "./components/navbars/index-navbar/index-navbar.component";
import { IndexDropdownComponent } from "./components/dropdowns/index-dropdown/index-dropdown.component";
import { PagesDropdownComponent } from "./components/dropdowns/pages-dropdown/pages-dropdown.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { UserDropdownComponent } from "./components/dropdowns/user-dropdown/user-dropdown.component";
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CreateClassComponent} from './views/admin/create_class/create_class.component';
import {DatePipe} from '@angular/common';
import {MarkAttendanceComponent} from './views/student/mark_attendance/mark_attendance.component';
import {StudentComponent} from './layouts/student/student.component';
import {StudentSidebarComponent} from './components/sidebar-student/student_sidebar.component';
import {StudentNavbarComponent} from './components/navbars/student-navbar/admin-navbar.component';
import {WebcamModule} from 'ngx-webcam';
import {StudentDashboardComponent} from './views/student/student_dashboard/student_dashboard.component';
import { CardStatsComponent } from "./components/cards/card-stats/card-stats.component";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    IndexDropdownComponent,
    PagesDropdownComponent,
    UserDropdownComponent,
    SidebarComponent,
    StudentSidebarComponent,
    FooterComponent,
    FooterSmallComponent,
    FooterAdminComponent,
    HeaderStatsComponent,
    AuthNavbarComponent,
    AdminNavbarComponent,
    IndexNavbarComponent,
    AdminComponent,
    AuthComponent,
    TablesComponent,
    LoginComponent,
    RegisterComponent,
    LandingComponent,
    CreateClassComponent,
    StudentComponent,
    StudentNavbarComponent,
    MarkAttendanceComponent,
    StudentDashboardComponent,
    CardStatsComponent,
  ],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, FormsModule, BrowserAnimationsModule, ToastrModule.forRoot(), WebcamModule],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
