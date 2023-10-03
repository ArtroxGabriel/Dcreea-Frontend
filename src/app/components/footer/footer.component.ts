import { Component, OnInit } from "@angular/core";
import "@cds/core/icon/register.js";
import { ClarityIcons, userIcon, envelopeIcon, terminalIcon, cameraIcon, certificateIcon, employeeIcon } from "@cds/core/icon";
const logo = require("!!raw-loader!../../../assets/images/logo.svg") as string;

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"],
})
export class FooterComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    ClarityIcons.addIcons(userIcon);
    ClarityIcons.addIcons(envelopeIcon);
    ClarityIcons.addIcons(terminalIcon);
    ClarityIcons.addIcons(cameraIcon);
    ClarityIcons.addIcons(certificateIcon);
    ClarityIcons.addIcons(employeeIcon);
  }
}
