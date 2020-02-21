import { Component, OnInit } from "@angular/core";
import { Job } from "src/models/job-model";
import { HomeServiceService } from "../services/home-service.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  jobs: Job[] = [];

  constructor(private jobapi: HomeServiceService) {}

  ngOnInit() {
    this.jobapi.getJobs().subscribe(
      (res: Job[]) => {
        this.jobs = res;
        console.log("subscriber: here you go :)", this.jobs);
      },
      err => {
        console.log(err);
      }
    );
  }
}
