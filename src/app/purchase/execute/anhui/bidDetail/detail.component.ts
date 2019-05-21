import { Component,OnDestroy } from '@angular/core';
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
    sub1;sub2;
    model = {purchasePlan:[],id:"",purchasePlanType:0};
    constructor(private router: Router,private route:ActivatedRoute,  private auth: AuthHttpService, private http: Http) {
        
    }
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private options = new RequestOptions({ headers: this.headers });
    //录入采购结果部分
    eleBought:number = 0;
    price:number = 0;
    filesModel = {
        isValid: false,
        isPristine: true
    }
  purchaseExecuteFiles = [];

    submit(e,m){
         
        if(!m.valid||!this.filesModel.isValid) return;
        let postValue = {purchaseExecuteFiles:[],purchasePlanId:"",purchasePlanType:2,actualPurchaseAmount:0,dealPrice:0};
        postValue.purchasePlanId = this.model.id;
        postValue.purchasePlanType = this.model.purchasePlanType;
        postValue.actualPurchaseAmount =this.eleBought;
        postValue.dealPrice = this.price;
        postValue.purchaseExecuteFiles = this.purchaseExecuteFiles;
        console.log(postValue);
        this.sub1=this.auth.post(`${environment.sellerEnergyPurchaseApi}api/AHPurchaseExecute`,postValue,this.options).subscribe((res)=>{
            let result = res.json();
             console.log(result);
            if(result.result){
                 this.router.navigate(['/purchase/execute/anhui/bid-check/',this.model.id]);
            }
        })
    }
    ngOnInit() {
        
        let id = this.route.snapshot.params['id'];
        this.sub2=this.auth.get(`${environment.sellerEnergyPurchaseApi}api/AHPurchaseExecute/GetModelInfo/${id}`).subscribe( (res) =>{
            let result = res.json();
            this.model = result;
        });
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
    }
}