import {Component,OnDestroy} from '@angular/core';
import {Http} from '@angular/http';
import { DetailService } from '../detail.service';
declare var $:any;
@Component({
  	selector: 'client-detai-sale',
  	templateUrl: './sale.component.html',
  	styleUrls:['./sale.scss']
})
export class ClientSale implements OnDestroy{
	sub1;
	private gridData=[];
	constructor(private http:Http,private service:DetailService){
		service.setActive('sale');
		this.sub1=this.http.get('../../../../../../assets/script/product.json').subscribe((res)=>{
			this.gridData = res.json();
		})
	}
	ngOnInit(){
		$("#monthpicker").kendoDatePicker({
		    start: "year",
		    depth: "year",
		    format: "yyyy MMMM"
		});
	}
	    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
    }
}
