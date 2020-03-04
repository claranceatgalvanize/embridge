import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-logout",
  templateUrl: "./logout.component.html",
  styleUrls: ["./logout.component.scss"]
})
export class LogoutComponent implements OnInit {
  userLogInStatus: boolean = false;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.logInStatus();
  }

  logInStatus() {
    const isThisUserLogIn = this.auth.isLoggedIn();
    return isThisUserLogIn ? (this.userLogInStatus = true) : null;
  }

  logout() {
    this.auth.logout();
  }
}
