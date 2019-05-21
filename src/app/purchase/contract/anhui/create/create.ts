import { Component,OnDestroy } from '@angular/core';
import { Router ,ActivatedRoute} from '@angular/router';
import { AuthHttpService } from '../../../../+common/services/auth-http.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { environment } from '../../../../../environments/environment';
declare var $: any;

@Component({
	selector: 'contract-create',
	templateUrl: './create.component.html',
	styleUrls: ['./create.scss']
})
export class ContractCreate implements OnDestroy {
	sub1;sub2;sub3;sub4;sub5;
	constructor(private auth: AuthHttpService,public route: ActivatedRoute,public router: Router, private http: Http) { 

	};
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private options = new RequestOptions({ headers: this.headers });
	//合约有效期
	public timeImpose: Date;
	public beginDate: Date;
	public endDate: Date;

	//备案日期
	public recordDate: Date;

	//合约方式 
	contractTypes: Array<{ text: string, value: number }> = [
		{ text: "长协", value: 1 }
	]
	contractType: { text: string, value: number };
	contractTypePlaceHolder = { text: "请选择合约方式", value: null };

	//交易中心
	tradingCenters: Array<{ text: string, value: number }> = [
		{ text: "安徽交易中心", value: 34 }
	]
	tradeCenterId: { text: string, value: number };
	tradingCenterPlaceHolder = { text: "请选择交易中心", value: null };

    //地区
	private provinceData:Array<{name:string,code:number}> = [];	
	private cities:Array<{name:string,code:number}> = [];	
	getProvince(){
		let getProvinceUrl = `${environment.sellerCRMApi}api/Customer/GetProvince`;
		this.sub1=this.auth.get(getProvinceUrl).subscribe((res)=>{
			let result=res.json();
            this.provinceData = result;
		});
	}
	getCities(provinceCode,m){
		let citiesUrl = `${environment.sellerCRMApi}api/Customer/GetCities/?parentCode=${provinceCode}`;
		this.sub2=this.auth.get(citiesUrl).subscribe((res)=>{
			let result=res.json();
            this.cities = result;
			this.powerPlantGetData = m;
		});
	}
	provincePlaceHolder = { name: "请选择省份", code: null };
	cityPlaceHolder = { name: "请选择城市", code: null };

	//发电类型
	types: Array<{ text: string, value: string }> = [
		{ text: "火力", value: "1" },
		{ text: "水力", value: "2" },
		{ text: "风力", value: "3" },
		{ text: "光伏", value: "4" }
	]
	type: { text: string, value: number };
	typePlaceHolder = { text: "请选择发电类型", value: null };

	//联系方式
	contactTel: string;

	//实购电量
	greatIndustryDealEq: number;


	//交易价格
	dealPrice: number;


	//用电时间
	public duration: Date;


	//合约电子档
	filesModel = {
		isValid: false,
		isPristine: true
	}
	postData = {
		"energyContract":{purchaseExecuteId:"",duration:''},
		"energyContractFileList":[]
	}
	onsubmit(e, m) {
		for (let k in m.value) {
			if (m.value[k] == undefined || m.value[k] == null || m.value[k] == "") {
				return;
			}
		}
		debugger;
		if(!m.valid)return;
		if(this.defaultData.duration==null||this.defaultData.duration==undefined||this.defaultData.duration=="")return;
		if(!this.filesModel.isValid||this.filesModel.isPristine) return;
		this.postData.energyContract = m.value;
		this.postData.energyContract.purchaseExecuteId = this.id;
		this.postData.energyContract.duration = this.defaultData.duration;
		for(let k in this.modelData){
			this.postData.energyContract[k] = this.powerPlantGetData[k];
		}
		this.sub3=this.auth.post(`${environment.sellerEnergyPurchaseApi}api/AHEnergyContract/EnergyContractSave`, this.postData, this.options).subscribe((res) => {
			console.log(res);
			let result=res.json();
			if(result.result){
				this.router.navigate(['/purchase/contract/anhui/list']);
			}else{
				alert(result.message);
			}

		})
	}

	onDateChange(e){
		this.timeImpose = e;
		if(this.beginDate > this.timeImpose){
			this.beginDate = this.timeImpose;
		}
		if(this.endDate < this.timeImpose){
			this.endDate = this.timeImpose;
		}
	}
	private powerPlantData;
	private id="";
	private defaultData = {tradeCenterId:"",dAmount:0,dealUnitPrice:0,dealPrice:0,duration:null};
	name:any;
	powerPlantGetData = {
		province:null,
		city:null,
		address:'',
		type:null,
		contactName:'',
		contactTel:'',
	};
	modelData = {
		province:null,
		city:null,
		address:'',
		type:null,
		contactName:'',
		contactTel:'',
	};
	powerPlantValueChange(dataItem){
		this.auth.get(`${environment.sellerEnergyPurchaseApi}api/ElectricityFactory/GetElectricityFactory/${dataItem}`).subscribe((res)=>{
			let result = res.json();
			this.getCities(result.province,result);
		})
	}


	ngOnInit() {
		this.id = this.route.snapshot.params['id'];
		if(this.id != null && this.id.length > 0 && this.id != "0"){
           	this.sub4=this.auth.get(`${environment.sellerEnergyPurchaseApi}api/AHEnergyContract/GetAddInitData/${this.id}`).subscribe((res)=>{
			this.defaultData = res.json();
			console.log(res.json());
			})
		}
		this.sub5=this.auth.get(`${environment.sellerEnergyPurchaseApi}api/ElectricityFactory/GetElectricityFactory`).subscribe((res)=>{
		    let result = res.json();
		    this.powerPlantData = result;
		})

		this.getProvince();
	}
	ngAfterViewInit(){
		var _this = this;
		let url = `${environment.sellerContractApi}api/Upload/Kendo_Image_Upload`
		$("#files").kendoUpload({
			async: {
				saveUrl: url,
				//removeUrl: "remove",
				autoUpload: true
			},
			validation: {
				allowedExtensions: [".jpg", ".jpeg", ".png", ".bmp", ".gif"]
			},
			success: onSuccess,
			showFileList: false,
			dropZone: ".dropZoneElement"
		});

		function onSuccess(e) {
			_this.filesModel.isPristine = false;
			if (e.operation == "upload") {
				console.log(e);
				for (var i = 0; i < e.files.length; i++) {

					var file = e.files[i].rawFile;

					if (file) {
						var reader = new FileReader();
						var fileId = e.response[i];
						reader.onloadend = function () {
							$("<div class='product'><img src=" + this.result + " id=" + fileId + " /><i class='iconfont icon-guanbipsd del'></i></div>").appendTo($("#products"));
						};
						reader.readAsDataURL(file);
						_this.filesModel.isValid = true;
						_this.postData.energyContractFileList.push({"fileDataId":fileId});
					}
				}
			}
		}
		$(document).on("click", ".product i", function () {
			$(this).parent().remove();
			var id = $(this).siblings("img").attr("id");
			var index = _this.postData.energyContractFileList.indexOf({"fileDataId":id});
			_this.postData.energyContractFileList.splice(index, 1);
			if (document.getElementById("products").childNodes.length == 0) {
				_this.filesModel.isValid = false;
			}
		})

        $("#datepicker").kendoDatePicker({
            start: "decade",
            depth: "decade",
            format: "yyyy",
            change:function() {
            	_this.defaultData.duration = this.value();
            }
        });

	}
	ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe();}
		if (this.sub4 !== undefined && this.sub4 !== null) { this.sub4.unsubscribe();}
		if (this.sub5 !== undefined && this.sub5 !== null) { this.sub5.unsubscribe();}
    }
}