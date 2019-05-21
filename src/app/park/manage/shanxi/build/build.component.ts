import {Component,ViewChild,OnDestroy} from '@angular/core';
import { Http ,Headers,URLSearchParams,RequestOptions} from '@angular/http';
import { AuthHttpService } from '../../../../+common/services/auth-http.service';
import { environment } from '../../../../../environments/environment';
import {
    FormGroup,
    FormControl
} from '@angular/forms';
declare var $:any;
@Component({
  	selector: 'anhui-cilent-build',
  	templateUrl: './build.component.html',
 	styleUrls:['./build.scss']
})


export class Build implements OnDestroy{
	sub1;sub2;sub3;sub4;sub5;sub6;
	isNext:boolean=false;
	public CategoryName:Array<{categoryName:string,id:number}> = [];
	public subCategoryName:Array<{categoryName:string,id:number}> = [];
	public powerUsedTypePlaceHolder = { text: "请选择用电类型", value: null };
	public placeHolder: { categoryName: string, id: number } = { categoryName: "选择用电客户行业类别", id: null };
	public provincePlaceHolder:{name:string,code:string} = { name: "用电主体所在省/直辖市", code: null };
	public citiesPlaceHolder:{name:string,code:string} = { name: "所在市/区", code: null };
	public powerUsedType: Array<{ text: string, value: number }> = [
        { text: "工商业用电", value: 1 },
        { text: "大工业用电", value: 2 },
        { text: "农业生产用电", value: 3 },
        { text: "居民生活用电", value: 4 }
    ];
	constructor(public auth:AuthHttpService,private http:Http){}
	getCategoryName(){
		let getCategoryNameUrl = `${environment.sellerCRMApi}api/Customer/GetCategoryFirst/`;
		this.sub1=this.auth.get(getCategoryNameUrl).subscribe((res)=>{
			let result=res.json();
            this.CategoryName = result;
		})
	}
	getSubCategoryName(categoryNameId){
		let getCategoryNameUrl = `${environment.sellerCRMApi}api/Customer/GetCategorySecond/?parentId=${categoryNameId}`;
		this.sub2=this.auth.get(getCategoryNameUrl).subscribe((res)=>{
			let result=res.json();
            this.subCategoryName = result;
		});
	}
	categoryNameChange(e){
		this.subCategoryName = [];
		this.getSubCategoryName(e);
	}
	private province:Array<{name:string,code:number}> = [];	
	private cities:Array<{name:string,code:number}> = [];	
	getProvince(){
		let getProvinceUrl = `${environment.sellerCRMApi}api/Customer/GetProvince`;
		this.sub3=this.auth.get(getProvinceUrl).subscribe((res)=>{
			let result=res.json();
            this.province = result;
		});
	}
	provinceChange(e){
		 this.cities = [];
		this.getCities(e);
	}
	getCities(provinceCode){
		let citiesUrl = `${environment.sellerCRMApi}api/Customer/GetCities/?parentCode=${provinceCode}`;
		this.sub4=this.auth.get(citiesUrl).subscribe((res)=>{
			let result=res.json();
            this.cities = result;
		});
	}
	public categoryNameForm:{categoryName:string,id:number};

	public buildFirstForm: FormGroup = new FormGroup({
		IndustryCategoryFirstId: new FormControl(),
        UsedPowerType: new FormControl(),
        // categoryNameForm: new FormControl(),
        IndustryCategorySecondId: new FormControl(),
        Province: new FormControl(),
        City: new FormControl(),
        SubjectName:new FormControl(),
        ElectricityAmount:new FormControl()
    });


	public sendData={
		"UsedPowerType":"1",
		"SaleUserId":"5167b0e7-cab6-4682-9c30-e26f1b9ea9f2",
		"SubjectName":"呆ffffaaaa到",
		"IndustryCategoryFirstId":"65",
		"IndustryCategorySecondId":"67",
		"Province":"120000",
		"City":"120100",
		"ElectricityAmount":"222",
		"ProvinceCode":"120000",
		"LegalPerson":"faffff",
		"RegisterManagePlace":"sdsd",
		"Address":"sdadasdasdsa",
		"VoltageLevel":"22",
		"Capacitance":"88",
		"TransformerCapability":"888"
	};
	onNext(e){
		this.isNext = true;
	}
	sendTotleData(){
		for(let k in this.buildFirstForm.value){
			this.sendData[k] = this.buildFirstForm.value[k];
		}
		let totleUrl = `${environment.sellerCRMApi}api/Customer/CreateCustomerforApi/`;
		// this.auth.post(totleUrl,this.sendData).subscribe((res)=>{
		// 	let result=res.json();
		// 	console.log(result);
		// })
		let headers = new Headers({ 'Content-Type': 'application/json' });
	    let options = new RequestOptions({ headers: headers });

	    this.sub5=this.http.post(totleUrl, this.sendData, options)
        .subscribe((res)=>{
        	let result = res.json();
        	console.log(result);
        })
	}
	onSubmit(e){
		for(let k in this.buildSecondForm.value){
			this.sendData[k] = this.buildSecondForm.value[k];
		}
		this.sendTotleData();
	};
	skip(){
		this.sendTotleData();
	}

	

	public buildSecondForm: FormGroup = new FormGroup({
		LegalPerson: new FormControl(),
        RegisterManagePlace: new FormControl(),
        SaleUserId: new FormControl(),
        Address: new FormControl(),
        VoltageLevel: new FormControl(),
        Capacitance: new FormControl(),
        TransformerCapability: new FormControl()
    });
    public SaleUserData:Array<{fullName:string,id:string}> = [];
	getSaleUser(){
		let citiesUrl = `${environment.sellerCRMApi}api/Customer/GetSalesList`;
		this.sub6=this.auth.get(citiesUrl).subscribe((res)=>{
			let result=res.json();
            this.SaleUserData = result;
		});
	}

	ngOnInit(){
		this.getCategoryName();
		this.getProvince();
		this.getSaleUser();
		


		// var addNew = '<div class="text-center dialog-box">'
		//                     +'<img src="assets/images/pic-okla.png" class="pd-b20">'
		//                     +'<p>客户创建成功</p>'
		//               +'</div>'
		// function onOK(){

		// }
		// var dialog = $("#dialog");
		// dialog.kendoDialog({
		//     width: "450px",
		//     title: "提示",
		//     closable: true,
		//     modal: false,
		//     visible:false,
		//     content: addNew,
		//     actions: [
		//         { text: '确认', primary: true, action: onOK,className:"a-button"}
		//     ]
		// });


		// var addNewT = '<div class="text-center dialog-box">'
		//                     +'<img src="assets/images/pic-okla.png" class="pd-b20">'
		//                     +'<p class="size-18">客户创建成功！</p>'
		//                     +'<p class="ma-t10">请及时完善客户信息，便于您更好管理</p>'
		//               +'</div>'
		// function onOKT(){}
		// var dialogT = $("#dialogT");
		// dialogT.kendoDialog({
		//     width: "450px",
		//     title: "提示",
		//     // visible: false,
		//     closable: true,
		//     modal: false,
		//     visible:false,
		//     content: addNewT,
		//     actions: [
		//         { text: '确认', primary: true, action: onOKT,className:"a-button"}
		//     ]
		// });
	}
	    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe();}
        if (this.sub4 !== undefined && this.sub4 !== null) { this.sub4.unsubscribe();}
        if (this.sub5 !== undefined && this.sub5 !== null) { this.sub5.unsubscribe();}
        if (this.sub6 !== undefined && this.sub6 !== null) { this.sub6.unsubscribe();}
    }
}