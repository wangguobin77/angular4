import { Component ,OnDestroy} from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { AuthHttpService } from '../../../../+common/services/auth-http.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import{ environment } from '../../../../../environments/environment';

declare var $: any;
declare var kendo: any;

@Component({
    selector: 'detail',
    templateUrl: './detail.html',
    styleUrls: ['./detail.css']
})
export class DetailComponent implements OnDestroy{
    sub1;sub2;sub3;sub4;
    model = {purchasePlan:[],id:"",timeShow:"",purchasePlanType:0};
    constructor(private router: Router,private route:ActivatedRoute,  private auth: AuthHttpService, private http: Http) {
        
    }
    //录入采购结果部分
    powerPlantData:Array<string> = [];

    private monthlyplanData = [
            {
                "F":{"month":1,"monthValue":0},
                "T":{"month":2,"monthValue":0}
            },
            {
                "F":{"month":3,"monthValue":0},
                "T":{"month":4,"monthValue":0}
            },
            {
                "F":{"month":5,"monthValue":0},
                "T":{"month":6,"monthValue":0}
            },
            {
                "F":{"month":7,"monthValue":0},
                "T":{"month":8,"monthValue":0}
            },
            {
                "F":{"month":9,"monthValue":0},
                "T":{"month":10,"monthValue":0}
            },
            {
                "F":{"month":11,"monthValue":0},
                "T":{"month":12,"monthValue":0}
            }
        ];


    gridData = [];
    m:number = 0;
    private allChecked:boolean = false;
    private totleCount:number = 0;
    private contractIds =[];

    onChange(){
        this.m = 0;
        for(let k of this.gridData){
            if(!k.isChecked) {
                this.m += 1;
            }
        }
        if(this.m > 0){
            this.allChecked = false;
        }else{
            this.allChecked = true;
        }
        this.countTotle();
    }
    onAllChange(e){
        if(e){
            for(let k of this.gridData){
                k.isChecked = true;
            }
        }else{
            for(let k of this.gridData){
                k.isChecked = false;
            }
        }
        this.countTotle();
    }
    countTotle(){
        this.totleCount = 0;
        this.contractIds =[];
        for(let k of this.gridData){
            if(k.isChecked) {
                this.totleCount += k.purchaseAmountValue; 
                this.contractIds.push({contractsId: k.contractsId});
            }
        }
    }
    private searchContent:string;
    searchContract(){
        this.searchPost();
    }
    searchPost(){
        this.sub1=this.auth.post(`${environment.sellerEnergyPurchaseApi}api/AHPurchaseExecute/GetRelationContractInfo`,
        {
          "purchasePlanId": this.id,
          "name": this.searchContent
        }).subscribe((res)=>{
            let result = res.json();
            for(let k of result){
                k.isChecked = false;
            }
             
            this.gridData = result;
        })
    }
    private opened = false;



    private purchaseExecuteFiles = [];
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private options = new RequestOptions({ headers: this.headers });

    contractDetailId = "";
    submit(e,m){
        if(!m.valid||!this.filesModel.isValid) return;
        let postValue = {monthlyplanData:[],purchaseExecuteFiles:[],relationContractData:[],purchasePlanId:"",purchaseRelationYear:"",purchasePlanType:1};
        postValue.purchasePlanId = this.model.id;
        postValue.purchaseRelationYear = this.model.timeShow.replace("年","");
        postValue.purchasePlanType = this.model.purchasePlanType;
        postValue.relationContractData = this.contractIds;
        for(let k in m.value){
            if(parseInt(k) > 0||k == "allChecked"||k == "searchContent"){
                // postValue[k] = m.value[k];
            }else{
                postValue[k] = m.value[k];
            }
        }
        for(let k of this.monthlyplanData){
            postValue.monthlyplanData.push({planMonth:k.F.month,monthValue:k.F.monthValue});
            postValue.monthlyplanData.push({planMonth:k.T.month,monthValue:k.T.monthValue});
        }
        postValue.purchaseExecuteFiles = this.purchaseExecuteFiles;
        console.log(postValue);
        this.sub2=this.auth.post(`${environment.sellerEnergyPurchaseApi}api/AHPurchaseExecute`,postValue,this.options).subscribe((res)=>{
            let result = res.json();
             console.log(result);
            if(result.result){
                this.opened = true;
                this.contractDetailId = result.purchaseExecuteId;
            }else{ 
                alert(result.message); 
            }
        })
    }





    private id:string;

    filesModel = {
        isValid: false,
        isPristine: true
    }
    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.sub3=this.auth.get(`${environment.sellerEnergyPurchaseApi}api/AHPurchaseExecute/GetModelInfo/${this.id}`).subscribe( (res) =>{
            let result = res.json();
            this.model = result;
            console.log(result);

        });
        this.sub4=this.auth.get(`${environment.sellerEnergyPurchaseApi}api/ElectricityFactory/GetElectricityFactory`).subscribe((res)=>{
            let result = res.json();
            this.powerPlantData = result;
            console.log(result);
        })
        this.searchPost();
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
                        _this.filesModel.isPristine = false;
                        _this.purchaseExecuteFiles.push(fileId);
                    }
                }
            }
        }
        $(document).on("click", ".product i", function () {
            $(this).parent().remove();
            var id = $(this).siblings("img").attr("id");
            var index = _this.purchaseExecuteFiles.indexOf(id);
            _this.purchaseExecuteFiles.splice(index, 1);
            if (document.getElementById("products").childNodes.length == 0) {
                _this.filesModel.isValid = false;
            }
        })
    }
        ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe();}
		if (this.sub4 !== undefined && this.sub4 !== null) { this.sub4.unsubscribe();}
    }
}