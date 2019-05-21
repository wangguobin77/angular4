import {Component, OnDestroy} from '@angular/core';
import {AuthHttpService} from '../../+common/services/auth-http.service'
import { environment } from '../../../environments/environment';
import { SideNavService } from '../sideNav/sideNav.service';

@Component({
  	selector: 'purchased',
  	templateUrl: './purchased.component.html',
  	styleUrls:['./purchased.scss']
})

export class Purchased implements OnDestroy{
	sub1;
	private purchaseItems=[];
	constructor(private auth:AuthHttpService,private service:SideNavService){
		this.service.setWhichIsActive("purchased");
		this.sub1=auth.get(`${environment.appStoreApi}api/PurchasedApp`).subscribe((res)=>{
			let result = res.json();
			this.purchaseItems = result;
		})
	}
	ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
    }
}