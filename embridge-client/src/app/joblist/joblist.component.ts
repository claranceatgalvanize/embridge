import { Component, OnInit } from "@angular/core";
import { JoblistService } from "../services/joblist.service";
import { Job } from "src/models/job-model";

@Component({
  selector: "app-joblist",
  templateUrl: "./joblist.component.html",
  styleUrls: ["./joblist.component.scss"]
})
export class JoblistComponent implements OnInit {
  jobs: Job[] = [];

  constructor(private jobApi: JoblistService) {}

  ngOnInit() {
    this.jobApi.getJobs().subscribe(
      res => {
        this.jobs = res;
        console.log("subscriber: here you go :)", this.jobs);
      },
      err => console.log(err)
    );
  }
}
