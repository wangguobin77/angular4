import {Component,OnDestroy} from '@angular/core';
import {Http} from '@angular/http';
import { ActivatedRoute }  from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { AuthHttpService } from '../../../../../+common/services/auth-http.service';
import { DetailService } from '../detail.service';
declare var $:any;
@Component({
  	selector: 'client-detai-contract-manage',
  	templateUrl: './contract.component.html',
  	styleUrls:['./contract.scss']
})
export class ClientContract implements OnDestroy{
	sub1;sub2;
	private gridData=[];
	private titleResult={};
	constructor(private http:Http,private auth:AuthHttpService,private route: ActivatedRoute,private service:DetailService){
		service.setActive('contract');
		this.sub1=this.http.get('../../../../../../assets/script/product.json').subscribe((res)=>{
			this.gridData = res.json();
		})
		let urlId = +this.route.snapshot.params['id']; 
		 
		let url = `${environment.sellerCRMApi}api/ContractManage/ClientContract/?sellerSubjectId=${urlId}`;
		this.sub2=auth.get(url).subscribe((res)=>{
			let result = res.json();
			this.titleResult = res.json();
			console.log(this.titleResult);
		})
	}
	ngOnInit(){
	
	}
	    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
    }
}
