import { Component, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { AuthHttpService } from '../../../../../+common/services/auth-http.service';
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'newPrice-result',
    templateUrl: './result.component.html',
    styleUrls:['./result.scss']
})
export class Result{
	sub1;sub2;
	gridData = [];
	pageId:any;
	checked:any;
	opened:boolean = false;
	close(){
		this.opened = false;
	}
	constructor(private auth:AuthHttpService,private route:ActivatedRoute){}
	isSelectIt(event,listItem){
		if(event==false||event==true)return;
		event.stopPropagation();
		for(let k of this.gridData){
			if(k.salePackagesId==listItem.salePackagesId){
				listItem.isSelect = !listItem.isSelect;
			}else{
				k.isSelect = false;
			}
		}
		if(listItem.isSelect){
			this.checked = listItem.salePackagesId;
		}else{
			this.checked = null;
		}
	}
	submit(){
		if(this.checked==null||this.checked==undefined) {
			alert('请选择套餐');
			return;
		}
		let postData = {
		  "singlePackagesId": this.checked,
		  "sellerSubjectId": this.pageId
		}
		this.sub2=this.auth.post(`${environment.sellerCRMApi}api/AHQuoteProgram/CreateProgramme`,postData).subscribe((res)=>{
			let result = res.json();
			if(result.result) {
				this.opened = true;
			}
		})
	}
	ngOnInit(){
		this.pageId = this.route.snapshot.params['id'];
		let idArr = JSON.parse(localStorage.getItem('selectedPackages'));
		let postData = {
		  salePackagesIds: idArr
		}
		this.sub1=this.auth.post(`${environment.sellerCRMApi}api/AHQuoteProgram/GetPakageDetailById`,postData).subscribe((res)=>{
			let result = res.json();
			for(let k of result){
				k.isSelect = false;
			}
			this.gridData = result;
		})
	}
	ngOnDestroy(){
		if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe(); }
	}
}