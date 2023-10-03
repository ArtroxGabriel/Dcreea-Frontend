import { Component, OnInit } from "@angular/core";
import "@cds/core/icon/register.js";
import { ClarityIcons, flagIcon } from "@cds/core/icon";

@Component({
  selector: "app-help",
  templateUrl: "./help.component.html",
  styleUrls: ["./help.component.css"],
})
export class HelpComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    ClarityIcons.addIcons(flagIcon);
  }
}
