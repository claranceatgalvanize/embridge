import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { UserDetails } from "../models/models";
import { MessageService } from "../services/message.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit {
  userCredentials;
  userLogInStatus: boolean;

  constructor(private auth: AuthService, private msg: MessageService) {}

  ngOnInit() {
    this.getUserInfo();
  }

  logInStatus() {
    const isThisUserLogIn = this.auth.isLoggedIn();
    return isThisUserLogIn ? (this.userLogInStatus = true) : null;
  }

  getUserInfo(): void {
    this.userCredentials = { ...this.auth.getUserDetails() };
    this.msg.add(this.userCredentials);
  }
}
