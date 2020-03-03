import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"]
})
export class SignInComponent implements OnInit {
  credentials = {
    email: "",
    password: ""
  };

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {}

  signIn() {
    this.auth.login(this.credentials).subscribe(
      () => {
        this.router.navigateByUrl("/joblist");
      },
      err => console.log(err)
    );
  }
}
