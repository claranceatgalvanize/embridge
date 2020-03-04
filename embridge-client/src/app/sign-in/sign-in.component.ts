import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { MessageService } from "../services/message.service";

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

  constructor(
    private auth: AuthService,
    private router: Router,
    private msg: MessageService
  ) {}

  ngOnInit() {}

  signIn() {
    this.auth.login(this.credentials).subscribe(
      () => {
        this.router.navigateByUrl("/joblist");
      },
      err => this.msg.add(err)
    );
  }
}
