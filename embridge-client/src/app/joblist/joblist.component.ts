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
  searchTerm: string;
  loadingState: boolean = true;

  constructor(private joblistService: JoblistService) {}

  ngOnInit() {
    this.getJobs();
  }

  getJobs(): void {
    this.joblistService.getJobs().subscribe(data => {
      this.jobs = [...data];
      this.loadingState = false;
    });
  }

  // jobsearch(term: string): void {
  //   term.toLocaleLowerCase();
  //   const newJobList = this.jobs.filter(job => job.includes(term));
  //   this.jobs = newJobList;
  // }
}
