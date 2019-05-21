import {Component,OnDestroy} from '@angular/core';
import { ActivatedRoute }  from '@angular/router';
import { SideNavService } from '../../sideNav/sideNav.service';
import { AuthHttpService } from '../../../+common/services/auth-http.service';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'order-detail',
  templateUrl: './orderDetail.component.html',
  styleUrls:['./orderDetail.scss']
})
export class OrderDetail implements OnDestroy {
	sub1;
	constructor(public route: ActivatedRoute,private auth:AuthHttpService,public sideNavService:SideNavService){
		sideNavService.setWhichIsActive("orderRecord");
	}
	private gridData =[];
	private totlePrice:number = 0;
	private orderDetailData = {};
	ngOnInit(){
		let id = this.route.snapshot.params['id'];
		let url = `${environment.appStoreApi}api/Order/${id}`;
		this.sub1=this.auth.get(url).subscribe((res)=>{
			let result = res.json();
			console.log(result);
			this.orderDetailData = result;
			this.gridData = result.items;
			for(let k of result.items){
				this.totlePrice += k.amount;
			}
		})
	}
	ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
    }
}