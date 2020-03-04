import { BrowserModule } from "@angular/platform-browser";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { HomeComponent } from "./home/home.component";
import { JoblistComponent } from "./joblist/joblist.component";
import { JobDetailComponent } from "./job-detail/job-detail.component";
import { LinePrelarderComponent } from "./line-prelarder/line-prelarder.component";
import { FilterPipe } from "./filter.pipe";
import { SignInComponent } from './sign-in/sign-in.component';
import { AboutComponent } from './about/about.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LogoutComponent } from './logout/logout.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    JoblistComponent,
    JobDetailComponent,
    LinePrelarderComponent,
    FilterPipe,
    SignInComponent,
    AboutComponent,
    SignUpComponent,
    LogoutComponent,
    ProfileComponent
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}
