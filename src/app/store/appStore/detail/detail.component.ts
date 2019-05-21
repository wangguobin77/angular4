import {Component,ViewEncapsulation,OnDestroy} from '@angular/core';
import { AuthHttpService }  from '../../../+common/services/auth-http.service';
import { ActivatedRoute }  from '@angular/router';
import { environment } from '../../../../environments/environment';
import { SideNavService } from '../../sideNav/sideNav.service';
@Component({
	// encapsulation: ViewEncapsulation.None,
  	selector: 'appstore-detail',
  	templateUrl: './detail.component.html',
  	styleUrls:['./detail.scss']
})
export class AppStoreDetail implements OnDestroy {
	sub1;
	sub2;
	private storeDetailData = [];
	private	storeDetailDataApp = [];
	private developer = {};
	private flag:boolean;
	public shufflingPic = {
		"boxHeight":"444px",
		"btnShow":true,
		"pic":[]
	};
	constructor(public auth:AuthHttpService,private route:ActivatedRoute,private sideNavService:SideNavService){
		sideNavService.setWhichIsActive("appStore");
	}
	ngOnInit(){
		this.getData();
	}
	getData(){
		this.sub1=this.auth.get(`${environment.appStoreApi}api/AppStore/${this.route.snapshot.params['id']}`).subscribe((res)=>{
			let result = res.json();
			this.storeDetailData = result;
			this.storeDetailDataApp = result.app;
			this.developer = result.developer;
			if(result.componentList!=null&&result.componentList!=undefined){
				if(result.componentList.length==0){
					this.flag = false;
				}else{
					this.flag = true;
				}
			}
			let i = 0;
			for(let k in result.imageList){
				this.shufflingPic.pic.push({
					"imgUrl":result.imageList[k].src,
					"isShow":i==0?true:false,
					"url":''
				});
				i++;
			} 
		})
	}
	addToCart(appId){
		this.sub2=this.auth.post(`${environment.appStoreApi}api/Cart`,[appId]).subscribe((res)=>{
			this.getData();
		})
	}
	ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
		if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
    }
}