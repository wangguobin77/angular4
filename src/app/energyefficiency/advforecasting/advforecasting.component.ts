import { NgModule, OnInit, AfterViewInit, Component } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-advforecasting',
  templateUrl: './advforecasting.component.html',
  styleUrls: ['./advforecasting.component.css']
})
export class AdvForecastingComponent implements OnInit,AfterViewInit {

  constructor() { }

  ngOnInit() {
    $.showMenu(1);
  }
  ngAfterViewInit() {
    $.showSide(10804);
  }
}
