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
  loadingState: boolean = true;

  constructor(private joblistService: JoblistService) {}

  ngOnInit() {
    this.getJobs();
  }

  getJobs(): void {
    this.joblistService.getJobs().subscribe(jobs => {
      this.jobs = [...jobs];
      this.loadingState = false;
    });
  }
}
