import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap, catchError } from "rxjs/operators";
import { Observable, of } from "rxjs";

import { MessageService } from "./message.service";
import { JobDetails } from "../models/models";

const jobapi =
  "https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions";

@Injectable({
  providedIn: "root"
})
export class JoblistService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getJobs(): Observable<JobDetails[]> {
    return this.http
      .get<JobDetails[]>(`${jobapi}.json?&location=usa`)
      .pipe(
        tap(
          () => this.log("Fetched jobs successfully!!!"),
          catchError(this.handleError<JobDetails[]>("getJobs", []))
        )
      );
  }

  getJob(id: string): Observable<JobDetails> {
    const url = `${jobapi}/${id}.json?markdown=true`;
    return this.http
      .get<JobDetails>(url)
      .pipe(
        tap(
          () => this.log("Fetched Job successfully!!!"),
          catchError(this.handleError<JobDetails>("getJobs"))
        )
      );
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`JobService: ${message}`);
  }
}
