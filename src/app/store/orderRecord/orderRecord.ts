import {Component,ViewEncapsulation,OnDestroy} from '@angular/core';
import {Http} from '@angular/http';
import { OnInit }    from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SideNavService } from '../sideNav/sideNav.service';
import { AuthHttpService } from '../../+common/services/auth-http.service';
import { environment } from '../../../environments/environment';
import { Router} from '@angular/router';
import { OrderRecordService }  from './orderRecord.service';
import {sideNav} from '../sideNav/sideNav';
import { State } from '@progress/kendo-data-query';
import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';

@Component({
	encapsulation: ViewEncapsulation.None,
  	selector: 'orderRecord',
  	templateUrl: './orderRecord.html',
  	styleUrls:['./orderRecord.scss']
})
export class OrderRecord implements OnDestroy{
	sub1;
	sub2;
	public whichIsActive = "orderRecord";
	public view: Observable<GridDataResult>;
	private opened:boolean = false;
    public state: State = {
        skip: 0,
        take: 5
    }; 
	public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.service.query(state);
    }
	constructor(public service:OrderRecordService,private router:Router,public sideNavService:SideNavService,private auth:AuthHttpService) {
		this.sideNavService.setWhichIsActive("orderRecord");
		this.view = service;
		console.log(service)
        this.service.query(this.state);
	} 
	ngOnInit(){
		this.loadData()
	}
  	public loadData(){
		
	}
	deleteOrder(e){
		this.sub1=this.auth.delete(`${environment.appStoreApi}api/Order/${e}`).subscribe((res)=>{
			this.service.query(this.state);
		})
	}
	showDialog(){
		this.opened = true;
	}
	close(){
		this.opened = false;
	}
	buyAgain(orderId){
		this.sub2=this.auth.post(`${environment.appStoreApi}api/AgainPurchase`,orderId).subscribe((res)=>{
			this.router.navigate(['/store/cart']);
		})
	}
	ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
		if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
    }
}