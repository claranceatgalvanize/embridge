import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";

import { Job } from "src/models/job-model";

const jobapi =
  "https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json?&location=usa";

@Injectable({
  providedIn: "root"
})
export class JoblistService {
  constructor(private http: HttpClient) {}

  getJobs(): Observable<Job[]> {
    return this.http
      .get<Job[]>(jobapi)
      .pipe(tap(() => console.log("Observable: one moment.")));
  }
}
