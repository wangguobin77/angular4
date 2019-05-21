import {Component,ViewEncapsulation, OnDestroy} from '@angular/core';
import { AuthHttpService }  from '../../../+common/services/auth-http.service';
import { ActivatedRoute }  from '@angular/router';
import { environment } from '../../../../environments/environment';
import { SideNavService } from '../../sideNav/sideNav.service';
import { Router} from '@angular/router';
@Component({
	// encapsulation: ViewEncapsulation.None,
  	selector: 'saleTool',
  	templateUrl: './saleTool.component.html',
  	styleUrls:['./saleTool.scss']
})
export class SaleTool implements OnDestroy {
	sub1;
	sub2;
	private saleToolData= {};
	private developer = {};
	public shufflingPic = {
		"boxHeight":"444px",
		"btnShow":true,
		"pic":[]
	};
	constructor(public auth:AuthHttpService,private route:ActivatedRoute,private sideNavService:SideNavService,private router:Router){
		sideNavService.setWhichIsActive("appStore");
	}
	ngOnInit(){
		this.getData();
	}

	getData(){
		this.sub1=this.auth.get(`${environment.appStoreApi}api/SellTool/${this.route.snapshot.params['id']}`).subscribe((res)=>{
			let result = res.json();
			this.saleToolData = result;
			this.developer = result.developer;
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
	private wifiModel:boolean = false;
	private lteModel:boolean = false;
	addToCart(w,l){
		if(!this.wifiModel&&!this.lteModel){
			alert("请选择销售工具版本");
		}
		let appId = [];
		if(this.wifiModel){
			appId.push(w);
		}
		if(this.lteModel){
			appId.push(l);
		}
	    this.sub2=this.auth.post(`${environment.appStoreApi}api/Cart`,appId).subscribe((res)=>{
	        this.router.navigate(['/store/cart']);
	    })
	}
	ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
		if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
    }
}