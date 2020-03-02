import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import marked from "marked";

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
  apply: boolean = false;

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
      const [how_to_apply] = data.how_to_apply.match(
        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
      );
      const description = marked(data.description);
      this.job = {
        ...data,
        description,
        how_to_apply
      };
      this.loadingState = false;
    });
  }

  goBack(): void {
    this.router.navigate(["/joblist"]);
  }
}
