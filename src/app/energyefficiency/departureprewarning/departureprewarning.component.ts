import { NgModule, OnInit, AfterViewInit, Component } from '@angular/core';

declare var $: any;


@Component({
  selector: 'app-departureprewarning',
  templateUrl: './departureprewarning.component.html',
  styleUrls: ['./departureprewarning.component.css']
})
export class DeparturePrewarningComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
    $.showMenu(1);
  }
  ngAfterViewInit() {
    $.showSide(10805);
  }
}
