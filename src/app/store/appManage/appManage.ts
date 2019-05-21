import {Component,ViewEncapsulation, OnDestroy} from '@angular/core';
import { Http ,Headers,URLSearchParams,RequestOptions} from '@angular/http';
import { OnInit }    from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SideNavService } from '../sideNav/sideNav.service';
import { AppManageService }  from './appManage.service';
import {AuthHttpService} from '../../+common/services/auth-http.service'
import { environment } from '../../../environments/environment';
import { Router} from '@angular/router';
declare var $:any;


@Component({
	encapsulation: ViewEncapsulation.None,
  	selector: 'appManage',
  	templateUrl: './appManage.html',
  	styleUrls:['./appManage.scss']
})
export class AppManage implements OnInit ,OnDestroy{
	sub1;
	sub2;
	public whichIsActive = "appManage";
	public products=[];
	effectiveApps = [];
	comingExpirationApps = [];
	expirationApps = [];

	destorySubscribeFirst:any;
	destorySubscribeSecond:any;
	constructor(public postService:AppManageService,public sideNavService:SideNavService,private auth:AuthHttpService,private router:Router,private http:Http) {
		this.sideNavService.setWhichIsActive("appManage");
		this.destorySubscribeFirst = auth.get(`${environment.appStoreApi}api/MyApps`).subscribe((res)=>{
			let result = res.json();
				 
			for(let k in result){
				for(let m of result[k]){
					m.isChecked = false;
				}
			}
			console.log(result);
			this.effectiveApps = result.effectiveApps;
			this.comingExpirationApps = result.comingExpirationApps;
			this.expirationApps = result.expirationApps;
		})
	} 
	ngOnInit(){
		this.loadData()
	}
  	public loadData(){
  		$("#tabstrip").kendoTabStrip({
		    animation:  {
		        open: {
		            effects: "fadeIn"
		        }
		    }
		});
	}

	m:number = 0;
	em:number = 0;
	isSelectAll:boolean = false;
	selectedCount:number = 0;
	onChange():void{
		this.setNum();
		this.m = 0;
		for(let k of this.effectiveApps){
			if(!k.isChecked){
				this.m = this.m+1;
			}else{
				this.em = this.em+1;
			}
		}
		if(this.m>0) {
			this.isSelectAll = false;
		}else{
			this.isSelectAll = true;
		}
	}
	isSelectAllChange(e):void{
		if(e){
			for(let k of this.effectiveApps){
				k.isChecked = true;
				this.em += 1;
			}
		}else{
			for(let k of this.effectiveApps){
				k.isChecked = false;
			}
		}
		this.setNum();
	}
	setNum(){
		this.selectedCount = 0;
		for(let k of this.effectiveApps){
			if(k.isChecked){
				this.selectedCount += 1;
			}
		}
	}


	j:number = 0;
	ej:number = 0;
	ceIsSelectAll:boolean = false;
	ceSelectedCount:number = 0;
	onCeChange():void{
		this.ceSetNum();
		this.j = 0;
		for(let k of this.comingExpirationApps){
			if(!k.isChecked){
				this.j = this.j+1;
			}else{
				this.ej = this.ej+1;
			}
		}
		if(this.j>0) {
			this.ceIsSelectAll = false;
		}else{
			this.ceIsSelectAll = true;
		}
	}
	ceIsSelectAllChange(e){
		if(e){
			for(let k of this.comingExpirationApps){
				k.isChecked = true;
				this.ej += 1;
			}
		}else{
			for(let k of this.comingExpirationApps){
				k.isChecked = false;
			}
		}
		this.ceSetNum();
	}
	ceSetNum(){
		this.ceSelectedCount = 0;
		for(let k of this.comingExpirationApps){
			if(k.isChecked){
				this.ceSelectedCount += 1;
			}
		}
	}

	l:number = 0;
	el:number = 0;
	cIsSelectAll:boolean = false;
	cSelectedCount:number = 0;
	onCChange():void{
		this.cSetNum();
		this.l = 0;
		for(let k of this.expirationApps){
			if(!k.isChecked){
				this.l = this.l+1;
			}else{
				this.el = this.el + 1
			}
		}
		if(this.l>0) {
			this.cIsSelectAll = false;
		}else{
			this.cIsSelectAll = true;
		}
	}
	cIsSelectAllChange(e){
		if(e){
			for(let k of this.expirationApps){
				k.isChecked = true;
				this.el += 1;
			}
		}else{
			for(let k of this.expirationApps){
				k.isChecked = false;
			}
		}
		this.cSetNum();
	}
	cSetNum(){
		this.cSelectedCount = 0;
		for(let k of this.expirationApps){
			if(k.isChecked){
				this.cSelectedCount += 1;
			}
		}
	}

	opened:boolean = false;
	renew(){
		if(this.em > 0){
			let arr = [];
			for(let k of this.effectiveApps){
				if(k.isChecked) {
					arr.push(k.id);
				}
			}
			this.postData(arr);
		}else{
			this.opened = true;
		}
	}
	ceRenew(){
		if(this.ej > 0){
			let arr = [];
			for(let k of this.comingExpirationApps){
				if(k.isChecked) {
					arr.push(k.id);
				}
			}
			this.postData(arr);
		}else{
			this.opened = true;
		}
	}
	cRenew(){
		if(this.el > 0){
			let arr = [];
			for(let k of this.expirationApps){
				if(k.isChecked) {
					arr.push(k.id);
				}
			}
			this.postData(arr);
		}else{
			this.opened = true;
		}
	}
	close(){
		this.opened = false;
	}
	postData(arr){
		this.destorySubscribeSecond = this.auth.post(`${environment.appStoreApi}api/Cart`,arr).subscribe((res)=>{
			this.router.navigate(['/store/cart']);
		})
	}
	ngOnDestroy(){
		if (this.destorySubscribeFirst !== undefined && this.destorySubscribeFirst !== null) { this.destorySubscribeFirst.unsubscribe();}
		if (this.destorySubscribeSecond !== undefined && this.destorySubscribeSecond !== null) { this.destorySubscribeSecond.unsubscribe();}
	}
}