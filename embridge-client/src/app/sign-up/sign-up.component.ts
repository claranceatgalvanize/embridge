import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../services/auth.service";
import { MessageService } from "../services/message.service";

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

  constructor(
    private auth: AuthService,
    private router: Router,
    private msg: MessageService
  ) {}

  ngOnInit() {}

  signUp() {
    this.auth.register(this.credentials).subscribe(
      () => {
        this.router.navigateByUrl("/joblist");
      },
      err => this.msg.add(err)
    );
    this.msg.add(this.credentials.name);
  }
}
