import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { MessageService } from "../services/message.service";

@Component({
  selector: "app-logout",
  templateUrl: "./logout.component.html",
  styleUrls: ["./logout.component.scss"]
})
export class LogoutComponent implements OnInit {
  constructor(private auth: AuthService, private msg: MessageService) {}

  ngOnInit() {}

  logInStatus() {
    if (this.auth.isLoggedIn()) {
      return true;
    }
  }

  logout() {
    this.auth.logout();
  }
}
