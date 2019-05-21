import {Component} from '@angular/core';
import { ActivatedRoute }  from '@angular/router';
import { DetailService } from './detail.service';
declare var $: any;
@Component({
  selector: 'client-service',
  template: `<div class="content-box">
				<div class="pageTitle">
					<i class="iconfont icon-hetong"></i>园区管理
					<a class="a-button-xian a-button-xian-grey float-r ma-r20 ma-t10" [routerLink]="['/client/park']">返回</a>
				</div>
				<div class="content">
					<div class="content-title">
						<a *ngFor="let item of menu" [routerLink]="[item.url,routeId]" [ngClass]="{active: item.isActive}" class="title ma-r60 color-9 cur-p">{{item.name}}</a>
					</div>
				</div>
				<router-outlet (activate)='onActivate($event)'></router-outlet>
			</div>`
})
export class Detail {
	ngAfterViewInit(){
        $.showSide(10104);
    }
	public routeId:number;
	public isActive:boolean;
	public menu:any;
	constructor(public route: ActivatedRoute,private service:DetailService) {

	}
	onActivate(component) {
		this.isActive = this.service.isActive;
		this.routeId = this.route.snapshot.children[0].params.id;
		this.menu = this.service.menu;
    }
}