import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"]
})
export class SignUpComponent implements OnInit {
  credentials = {
    name: "",
    email: "",
    password: ""
  };

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {}

  signUp() {
    this.auth.register(this.credentials).subscribe(
      () => {
        this.router.navigateByUrl("/job-list");
      },
      err => console.log(err)
    );
    console.log(this.credentials);
  }
}
