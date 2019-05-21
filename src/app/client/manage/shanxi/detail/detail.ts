import {Component} from '@angular/core';
import { ActivatedRoute }  from '@angular/router';
import { DetailService } from './detail.service';
declare var $:any;
@Component({
  selector: 'client-service',
  template: `<div class="content-box">
				<div class="pageTitle">
					<i class="iconfont icon-hetong"></i>电力客户
					<a class="a-button-xian a-button-xian-grey float-r ma-r20 ma-t10" [routerLink]="['/client/shanxi']">返回</a>
				</div>
				<div class="customer-table">
			        <a class="" name="0" [routerLink]="['/client/shanxi/customersx',routeId]">客户首页</a>
			        <a class="" [ngClass]="{active: !isSale}" name="1" [routerLink]="['/client/shanxi/detail/client',routeId]">客户档案</a>
			        <a class="" [ngClass]="{active: isSale}" name="2"  [routerLink]="['/client/shanxi/detail/sale',routeId]">销售信息</a>
			        <a class="none" name="3">价值分析</a>
			    </div>
				<div class="content">
					<div class="content-title" *ngIf="!isSale">
						<a *ngFor="let item of menu" [routerLink]="[item.url,routeId]" [ngClass]="{active: item.isActive}" class="title ma-r60 color-9 cur-p">{{item.name}}</a>
					</div>
					<div class="content-title" *ngIf="isSale">
						<a class="title ma-r60 color-9 cur-p">销售信息</a>
					</div>
				</div>
				<router-outlet (activate)='onActivate($event)'></router-outlet>
			</div>`,
	styleUrls:['./detail.scss']
})
export class Detail {
	ngAfterViewInit(){
        $.showSide(10101);
    }
    isSale:boolean;
	public routeId:number;
	public isActive:boolean;
	public menu:any;
	constructor(public route: ActivatedRoute,private service:DetailService) {

	}
	onActivate(component) {
		this.isActive = this.service.isActive;
		this.routeId = this.route.snapshot.children[0].params.id;
		this.menu = this.service.menu;
		this.isSale = this.service.isSale;
    }
}