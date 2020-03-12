import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { JoblistComponent } from "./joblist/joblist.component";
import { JobDetailComponent } from "./job-detail/job-detail.component";
import { AboutComponent } from "./about/about.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { RouteActivatorService as RouteActivator } from "./services/route-activator.service";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "home" },
  { path: "home", component: HomeComponent },
  { path: "about", component: AboutComponent },
  { path: "sign-in", component: SignInComponent },
  { path: "sign-up", component: SignUpComponent },
  {
    path: "joblist",
    component: JoblistComponent,
    canActivate: [RouteActivator]
  },
  {
    path: "job/details/:id",
    component: JobDetailComponent,
    canActivate: [RouteActivator]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
