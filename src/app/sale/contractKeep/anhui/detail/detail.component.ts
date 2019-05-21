import {Component,OnDestroy} from '@angular/core';
import { ActivatedRoute }  from '@angular/router';
import {AuthHttpService} from '../../../../+common/services/auth-http.service';
import { environment } from '../../../../../environments/environment';
declare var $:any;
@Component({
  	selector: 'detail',
  	templateUrl:'./detail.component.html',
  	styleUrls:['./detail.scss']
})
export class DetailComponent implements OnDestroy{
    sub1;
	constructor(private auth: AuthHttpService,public route: ActivatedRoute) {
    }
   
 contractDetail={
     id:0,
Name:"",
SerialNumber:"",
ContractTypeName:"",
Attachments :[],
FilesTypeOne:[],
FileTypeTwo:[],
};
    licenseData = {};
    legalCodeInformation = {};
    businessCodeInformation = {};
    orgCodeInformation = {};
    taxCodeInformation = {};
    ngOnInit(){
        $.showSide(10503);

        var _the = this;
        let contractid = _the.route.snapshot.params['id'];

		this.sub1 = this.auth.get(`${environment.sellerContractApi}api/AHContractFiling/AHDetail/${contractid}`).subscribe((res)=>{
			let data = res.json();
            if(data!=null){
                _the.contractDetail = data;
            }
			// _the.contractDetail.name = result;
			// this.legalCodeInformation = result.certificates.legalCodeInformation;
			// this.businessCodeInformation = result.certificates.businessCodeInformation;
			// this.orgCodeInformation = result.certificates.orgCodeInformation;
			// this.taxCodeInformation = result.certificates.taxCodeInformation;
		})
    	
    }
    public shufflingPic = {
      "boxHeight":"400px",
      "btnShow":false,
      "pic":[]
    };
    setPic(imgArr,n){
        this.shufflingPic.pic = [];
        for(let i = 0;i < imgArr.length;i ++){
            this.shufflingPic.pic.push({
                "imgUrl":imgArr[i].Src,
                "isShow":i == n
            });
        }
        this.popShow = true;
    }
    popShow:boolean = false;
    hidePop(event){
        if(event.target == document.getElementById("pop")){
            this.popShow = false;
        }
    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
    }
}