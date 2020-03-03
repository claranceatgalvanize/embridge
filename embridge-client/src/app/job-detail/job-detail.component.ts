import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import marked from "marked";

import { JoblistService } from "../services/joblist.service";
import { JobDetails } from "../models/job-details";

@Component({
  selector: "app-job-detail",
  templateUrl: "./job-detail.component.html",
  styleUrls: ["./job-detail.component.scss"]
})
export class JobDetailComponent implements OnInit {
  @Input() job: JobDetails;
  loadingState = true;
  apply = false;

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
      let [how_to_apply] = data.how_to_apply.match(
        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
      );
      const apply = `https://${how_to_apply}`;
      const description = marked(data.description);
      this.job = {
        ...data,
        description,
        how_to_apply: apply
      };
      this.loadingState = false;
    });
  }

  goBack(): void {
    this.router.navigate(["/joblist"]);
  }
}
