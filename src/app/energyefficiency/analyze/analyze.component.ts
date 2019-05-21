import { NgModule, OnInit, AfterViewInit, Component } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-analyze',
  templateUrl: './analyze.component.html',
  styleUrls: ['./analyze.component.css']
})
export class AnalyzeComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
    $.showMenu(1);
  }
  ngAfterViewInit() {
    $.showSide(10802);
  }
}
