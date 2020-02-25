import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { JoblistService } from "../services/joblist.service";
import { Job } from "src/models/job-model";

@Component({
  selector: "app-job-detail",
  templateUrl: "./job-detail.component.html",
  styleUrls: ["./job-detail.component.scss"]
})
export class JobDetailComponent implements OnInit {
  @Input() job: Job;
  loadingState: boolean = true;

  constructor(
    private jobService: JoblistService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.getJob(this.route.snapshot.params.id);
  }

  getJob(id: any): void {
    this.jobService.getJob(id).subscribe(data => {
      (this.job = data), (this.loadingState = false);
    });
  }

  goBack(): void {
    this.router.navigate(["/joblist"]);
  }
}
