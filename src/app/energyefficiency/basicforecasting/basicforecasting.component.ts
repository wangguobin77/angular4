import { NgModule, OnInit, AfterViewInit, Component } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-basicforecasting',
  templateUrl: './basicforecasting.component.html',
  styleUrls: ['./basicforecasting.component.css']
})
export class BasicForecastingComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
    $.showMenu(1);
  }
  ngAfterViewInit() {
    $.showSide(10803);
  }
}
