import { Component, ViewEncapsulation, OnInit, OnChanges } from '@angular/core';
// import { StoreService }  from './store.service';
// import {Routes }  from '@angular/router';
declare var $: any;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'store',
    template: `
        <section class="main">
            <sideNav></sideNav>
            <div class="main-right"><router-outlet></router-outlet></div>
        </section>
      `,
    styleUrls: ['../../assets/style/style.scss']
})
export class StoreComponent implements OnInit, OnChanges {
    // [whichIsActive]="whichIsActive"
    public whichIsActive: string;
    public a = 0;
    // constructor(public storeService:StoreService) {
    // 	//  
    // 	// this.whichIsActive = storeService.i
    // }
    ngOnInit() {
        $.showMenu(8);
        // let arr = location.pathname.split("/");
        // this.whichIsActive = arr[arr.length-1];
        // this.router.events
        //     .subscribe((event) => {
        //       console.log(event);   // 包括NavigationStart, RoutesRecognized, NavigationEnd
        //     });
    }
    ngOnChanges() {
        // let arr = location.pathname.split("/");
        // this.whichIsActive = arr[arr.length-1];
    }
    onActivate(component) {
        // this.whichIsActive = component.storeService.i;
        console.log('组件加载完成>' + component);
    }

    onDeactivate(component) {
        console.log('组件已经移除>' + component);
    }
}
