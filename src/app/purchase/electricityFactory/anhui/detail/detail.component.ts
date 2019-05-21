import { Component ,OnDestroy} from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router ,ActivatedRoute} from '@angular/router';
import { AuthHttpService } from '../../../../+common/services/auth-http.service';
import{ environment } from '../../../../../environments/environment';
import { Http ,Headers,URLSearchParams,RequestOptions} from '@angular/http';
import { Product } from './model';
import { FormValue } from './crewModel';
declare var $:any;

@Component({
    selector: 'ElectricityFactory-detail',
    templateUrl: './detail.component.html',
    styleUrls:['./detail.scss']
})

export class ElectricityFactoryDetail implements OnDestroy{
    sub1;sub2;sub3;sub4;sub5;sub6;sub7;sub8;sub9;sub10;sub11;
	constructor(private router: Router,public route: ActivatedRoute,private auth: AuthHttpService,private http:Http) {};
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private options = new RequestOptions({ headers: this.headers });
    private electricityFactoryId = this.route.snapshot.params['id'];//"4D764495-F976-435F-95DB-4B86075E531F";


    //顶部详情
    private isEdit = false;
    setIsEdit(){
        this.isEdit = true;
    }
    submitEdit(){
        this.sub11=this.auth.post(`${environment.sellerEnergyPurchaseApi}api/ElectricityFactory/EditElectricityFactory`,this.detailModel,this.options).subscribe((res)=>{
            console.log(res);
            let result = res.json();
            if(result.result){
                this.detailModel.voltageLevelName = this.voltageLevelName;
                this.isEdit = false;
            }
            else{
                alert(result.message);
            }
        })
    }
    private detailModel = {
        address:"",
        electricityFactoryId:this.electricityFactoryId,
        city:"",
        cityName:"",
        id:"",
        name:"",
        province:"",
        provinceName:"河北省",
        totalCapacity:0,
        voltageLevel:0,
        voltageLevelName:"",
        typeName:"",
        type:[]
    };
    detailData(){
        this.sub1=this.auth.get(`${environment.sellerEnergyPurchaseApi}api/ElectricityFactory/GetDetail/${this.electricityFactoryId}`).subscribe((res)=>{
            let result = res.json().data;
            this.getCities(result.province);
            for(let k in this.detailModel){
                if(k == "voltageLevel"){
                    result[k] = parseInt(result[k]);
                }else if(k == "type"&& result[k] != null&& result[k] != undefined){
                    for(let i = 0;i < result[k].length;i++){
                        result[k][i] = (parseInt(result[k][i]));
                    }
                }
            }
            console.log(result);
            this.detailModel = result;
        })
    }
    //电厂
    powerPlantData:Array<string> = [];

    //地区
    private provinceData:Array<{name:string,code:number}> = [];    
    private cities:Array<{name:string,code:number}> = [];    
    getProvince(){
        let getProvinceUrl = `${environment.sellerCRMApi}api/Customer/GetProvince`;
        this.sub2=this.auth.get(getProvinceUrl).subscribe((res)=>{
            let result=res.json();
            this.provinceData = result;
        });
    }
    provinceChange(e){
        this.cities = [];
        this.detailModel.city = null;
        this.getCities(e);
        for(let k of this.provinceData){
            if(k.code == e) {
                this.detailModel.provinceName = k.name;
            }
        }
    }
    getCities(provinceCode){
        let citiesUrl = `${environment.sellerCRMApi}api/Customer/GetCities/?parentCode=${provinceCode}`;
        this.sub3=this.auth.get(citiesUrl).subscribe((res)=>{
            let result=res.json();
            this.cities = result;
        });
    }
    provincePlaceHolder = {name:"请选择省份",code:null};
    cityPlaceHolder = {name:"请选择城市",code:null};

    onSubmit(m){
        if(m.valid){
            this.sub4=this.auth.post(`${environment.sellerEnergyPurchaseApi}api/ElectricityFactory/EditElectricityFactory`,this.detailModel, this.options)
            .subscribe((res)=>{
                let result = res.json();
                if(result.result){
                    this.isEdit = !this.isEdit;
                    this.detailModel.voltageLevelName = this.voltageLevelData[this.detailModel.voltageLevel-1].text;
                }
            })
            
        }
    }

    typeNameChange(e){
        this.detailModel.typeName = "";
        for(let k in e){
            this.detailModel.typeName += `${this.types[k].text},`;
        }
        this.detailModel.type = this.detailModel.type.slice(0,this.detailModel.type.length-1);
    }
    voltageLevelName:string;
    voltageLevelChange(e){
        this.voltageLevelName = this.voltageLevelData[e-1].text;
    }
    cityChange(e){
        for(let k of this.cities){
            if(k.code == e) {
                this.detailModel.cityName = k.name;
            }
        }
    }



	//联系人列表
	public view = [];

	private editForm = new FormGroup({
        'id': new FormControl(),
        'contactName': new FormControl(),
        'position': new FormControl(),
        'contactTel': new FormControl(),
        'remark': new FormControl()
    });
	private active: boolean = false;
	private isNew:boolean = false;
	public onSave(e): void {
        e.preventDefault();
        let thisValue = this.editForm.value;
        thisValue.electricityFactoryId = this.electricityFactoryId;
        this.sub5=this.auth.post(`${environment.sellerEnergyPurchaseApi}api/ElectricityFactory/SaveContact`, thisValue, this.options)
        .subscribe((res)=>{
            let result = res.json();
            if(result.result){
                this.getData();
            }
            console.log(result);
        })
        this.active = false;
    }

    public onCancel(e): void {
        e.preventDefault();
        this.active = false;
    }

    private closeForm(): void {
        this.active = false;
    }

    removeHandler({dataItem}): void{
        this.sub6=this.auth.post(`${environment.sellerEnergyPurchaseApi}api/ElectricityFactory/DeleteContact`,dataItem.id, this.options)
        .subscribe((res)=>{
            let result = res.json();
            if(result.result){
                this.getData();
            }
            console.log(result);
        })
    }

    addHandler(e){
        this.isNew = true;
        this.editForm.reset(new Product());
        this.active = true;
    }
    editHandler({dataItem}){
        this.isNew = false;
        this.active = true;
        this.editForm.reset(dataItem);
    }

    getData(){
        let id = this.electricityFactoryId;
        this.sub7=this.auth.get(`${environment.sellerEnergyPurchaseApi}api/ElectricityFactory/GetContactList/${id}`).subscribe((res)=>{
            console.log(res.json());
            this.view = res.json();
        })
    }


    //机组信息
    private crewView = [];
    private crewActive:boolean = false;
    private isCrewNew:boolean = false;
    // private crewEditForm = new FormGroup({
    //     'electricityFactoryId': new FormControl(),
    //     'crewName': new FormControl(),
    //     'crewCode': new FormControl(),
    //     'voltageLevel': new FormControl(),
    //     'generationType': new FormControl(),
    //     // "isBundlingMachine": new FormControl(),
    //     // "isRenewableEnergy": new FormControl()
    // });
    getCrewData(){
        let id = this.electricityFactoryId;
        this.sub8=this.auth.get(`${environment.sellerEnergyPurchaseApi}api/ElectricityFactory/GetCrewList/${id}`).subscribe((res)=>{
            console.log(res.json());
            this.crewView = res.json();
        })
    }
    crewCloseForm(){
         this.crewActive = false;   
    }

    //发电类型
    types:Array<{text:string,value:number}> = [
        {text:"火力",value:1},
        {text:"水力",value:2},
        {text:"风力",value:3},
        {text:"光伏",value:4}
    ]
    typePlaceHolder = {text:"请选择发电类型",value:null};
    
    //电压等级
    voltageLevelPlaceHolder = {text:"请选择电压等级",value:null};
    private voltageLevelData:Array<{text:string,value:number}> = [
        {text:"不满1千伏",value:1},
        {text:"1-10千伏",value:2},
        {text:"20千伏",value:3},
        {text:"35千伏",value:4},
        {text:"35-110千伏",value:5},
        {text:"110千伏",value:6},
        {text:"220千伏",value:7},
        {text:"220千伏及以上",value:8}
    ]

    formValue:FormValue = {
        id:0,
        electricityFactoryId:"0",
        'crewName': "",
        'crewCode': "",
        'voltageLevel': 0,
        'generationType': 0,
        "isBundlingMachine": true,
        "isRenewableEnergy": true
    }
    crewEditHandler({dataItem}){
         
        this.isCrewNew = false;
        this.crewActive = true;
        for(let k in this.formValue){
            if(k == "voltageLevel"||k == "generationType"){
                this.formValue[k] = parseInt(dataItem[k]);
            }
            else{
                this.formValue[k] = dataItem[k];
            }
        }
        // this.formValue.voltageLevel = 2;
         
    }
    crewAddHandler(e){
        this.isCrewNew = true;
        this.crewActive = true;
        this.formValue = new FormValue();
        this.formValue.electricityFactoryId = this.electricityFactoryId;
    }
    setBundlingMachine(n){
        this.formValue.isBundlingMachine = n;
    }
    setRenewableEnergy(n){
        this.formValue.isRenewableEnergy = n;
    }
    crewOnCancel(){
        this.formValue = new FormValue();
        this.crewActive = false;
    }
    crewRemoveHandler({dataItem}): void{
        this.sub9=this.auth.post(`${environment.sellerEnergyPurchaseApi}api/ElectricityFactory/DeleteCrew`,dataItem.id, this.options)
        .subscribe((res)=>{
            let result = res.json();
            if(result.result){
                this.getCrewData();
            }
            console.log(result);
        })
    }
    crewOnSave(){
		if (this.formValue.crewName == undefined || this.formValue.crewName == null || this.formValue.crewName == ""
            || this.formValue.crewCode == undefined || this.formValue.crewCode == null || this.formValue.crewCode == "") {
				return;
			}
		
        this.sub10=this.auth.post(`${environment.sellerEnergyPurchaseApi}api/ElectricityFactory/SaveCrew`,this.formValue, this.options)
        .subscribe((res)=>{
            let result = res.json();
            if(result.result){
                this.crewActive = false;
                this.getCrewData();
            }
            console.log(result);
        })
    }

	ngOnInit(){
        
        this.detailData();
        this.getProvince();
        this.getData();
        this.getCrewData();
 //        let a = {
 //            data:[]
 //        }
 //        let b = {
 //            "1":{
 //                "id":1,
 //                "nodes":{
 //                    "11":{
 //                        "id":11,
 //                        "nodes":{
 //                            "111":{
 //                                "id":111    
 //                            }
 //                        }    
 //                    }
 //                }    
 //            },
 //            "2":{
 //                "id":2,
 //                "nodes":{
 //                    "11":{
 //                        "id":22    
 //                    }
 //                }    
 //            }
 //        }
 //        function aa(m,n){
 //            for(let k in n){
 //                 
 //                m.push({id:n[k].id,nodes:[]});
 //                if(n[k].nodes != undefined&&n[k].nodes != null) {
 //                    aa(m[m.length - 1].nodes,n[k].nodes);
 //                }
 //            }

 //        }
 //        aa(a.data,b);
 //        console.log(a);
	}
        ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe();}
        if (this.sub4 !== undefined && this.sub4 !== null) { this.sub4.unsubscribe();}
        if (this.sub5 !== undefined && this.sub5 !== null) { this.sub5.unsubscribe();}
        if (this.sub6 !== undefined && this.sub6 !== null) { this.sub6.unsubscribe();}
        if (this.sub7 !== undefined && this.sub7 !== null) { this.sub7.unsubscribe();}
        if (this.sub8 !== undefined && this.sub8 !== null) { this.sub8.unsubscribe();}
        if (this.sub9 !== undefined && this.sub9 !== null) { this.sub9.unsubscribe();}
        if (this.sub10 !== undefined && this.sub10 !== null) { this.sub10.unsubscribe();}
        if (this.sub11 !== undefined && this.sub11 !== null) { this.sub11.unsubscribe();}
    }
}