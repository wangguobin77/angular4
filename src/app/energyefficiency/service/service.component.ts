import { NgModule, OnInit, AfterViewInit, Component } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
    $.showMenu(1);
  }
  ngAfterViewInit() {
    $.showSide(10806);
  }
}
