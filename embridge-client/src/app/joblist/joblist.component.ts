import { Component, OnInit } from "@angular/core";
import { JoblistService } from "../services/joblist.service";
import { JobDetails } from "../models/models";

@Component({
  selector: "app-joblist",
  templateUrl: "./joblist.component.html",
  styleUrls: ["./joblist.component.scss"]
})
export class JoblistComponent implements OnInit {
  jobs: JobDetails[] = [];
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
}
