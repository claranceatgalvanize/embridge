import { Component, OnInit } from "@angular/core";

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

  constructor() {}

  ngOnInit() {}

  signIn() {
    console.log("User Credentials: ", this.credentials);
  }
}
