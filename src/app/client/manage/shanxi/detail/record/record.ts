import { Component, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { DetailService } from '../detail.service';
import { environment } from '../../../../../../environments/environment';
import { AuthHttpService } from '../../../../../+common/services/auth-http.service';
import { ActivatedRoute,Router } from '@angular/router';
@Component({
    selector: 'client-detai-record',
    templateUrl: './record.component.html',
    styleUrls: ['./record.scss']
})
export class Record{
	sub1;sub2;
	gridData = [];
	priceActive:boolean = false;
	priceCode=0;
	pageId:any;
	priceCloseForm(){
		this.priceActive = false;
	}
	setPrice(){
		this.priceActive = true;
	}
	priceOnSave(m){
		this.router.navigate(['/client/shanxi/newPrice/list',this.pageId]);
	}
	constructor(private service:DetailService,private auth:AuthHttpService,private route:ActivatedRoute,private router:Router){
		service.setActive('record');
	}
	ngOnInit(){
		this.pageId = this.route.snapshot.params['id'];
		this.sub1 = this.auth.get(`${environment.sellerCRMApi}api/SXQuoteProgram/GetCustomerSalePackages?id=${this.pageId}`).subscribe((res)=>{
			let result = res.json();
			this.gridData = result.data;
		})
		this.sub2 = this.auth.get(`${environment.sellerCRMApi}api/SXQuoteProgram/GetElectricityAmount?id=${this.pageId}`).subscribe((res)=>{
			this.priceCode = res.json();
		})
	}
	ngOnDestroy(){
		if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe(); }
	}
}