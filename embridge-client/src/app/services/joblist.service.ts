import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap, catchError } from "rxjs/operators";
import { Observable, of } from "rxjs";

import { Job } from "src/models/job-model";
import { MessageService } from "./message.service";

// Append cors fix to api url
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

  getJobs(): Observable<Job[]> {
    return this.http
      .get<Job[]>(`${jobapi}.json?&location=usa`)
      .pipe(
        tap(
          () => this.log("Fetched jobs successfully!!!"),
          catchError(this.handleError<Job[]>("getJobs", []))
        )
      );
  }

  getJob(id: string): Observable<Job> {
    const url = `${jobapi}/${id}.json?markdown=true`;
    return this.http
      .get<Job>(url)
      .pipe(
        tap(
          () => this.log("Fetched job successfully!!!"),
          catchError(this.handleError<Job>("getJobs", new Job()))
        )
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`JobService: ${message}`);
  }
}
