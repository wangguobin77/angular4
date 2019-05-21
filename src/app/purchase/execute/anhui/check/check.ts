import { Component, OnInit,ViewEncapsulation ,OnDestroy} from '@angular/core';
import { Router ,ActivatedRoute} from '@angular/router';
import { AuthHttpService } from '../../../../+common/services/auth-http.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { environment } from '../../../../../environments/environment';

import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';

declare var $: any;
@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'execute-check',
    templateUrl: './check.component.html',
    styleUrls: ['./check.scss']
})
export class ExecuteCheck implements OnDestroy{
    sub1;sub2;
    environment = environment;
    private model = [];
    private gridData = [];
    private monthlyQtys={month1:0,month2:0, month3:0,month4:0, month5:0,month6:0, month7:0,month8:0, month9:0,month10:0, month11:0,month12:0};
    private files =[];
    constructor(private router: Router,public route: ActivatedRoute, private auth: AuthHttpService, private http: Http) {
        
    }
    public shufflingPic = {
        'boxHeight': '400px',
        'btnShow': false,
        'pic': []
    };
    popShow:boolean = false;
    setPic(imgArr, n) {
        this.shufflingPic.pic = [];
        for (let i = 0; i < imgArr.length; i++) {
            this.shufflingPic.pic.push({
                'imgUrl': imgArr[i].imageSrc,
                'isShow': i === n
            });
        }
        this.popShow = true;
    }
    hidePop(event) {
        if (event.target === document.getElementById('pop')) {
            this.popShow = false;
        }
    }

    ngOnInit() {
        let id = this.route.snapshot.params['id'];//'39fa9777-eabf-4d8e-9df3-5486e9ae733f';
        this.sub1=this.auth.get(`${environment.sellerEnergyPurchaseApi}api/AHPurchaseExecute/GetModelInfo/${id}`).subscribe( (res) =>{
            let result = res.json();
            console.log(res.json());
             this.model = result;
             this.files = result.purchaseExecuteFiles;
             console.log( result.electricityMonthlyplan);
             if(result.electricityMonthlyplan != null){
                for(var i = 1; i < 13;i++){
                    this.monthlyQtys['month'+i.toString()] =  result.electricityMonthlyplan[i.toString()];
                }
             }
               
             console.log( this.monthlyQtys);
        });
  
        this.sub2=this.auth.get(`${environment.sellerEnergyPurchaseApi}api/AHPurchaseExecute/GetRelationContractForDetial/${id}`).subscribe( (res) =>{
            let result = res.json();
            console.log(res.json());
             this.gridData = result;
        });
    //     $("#grid").kendoGrid({
    //     dataSource: {
    //         transport: {
    //             read: {
    //                 url: `${environment.sellerEnergyPurchaseApi}api/AHPurchaseExecute/GetRelationContractForDetial/${id}`,
    //                 dataType: "json",
    //                 type: "Get"
    //             },
    //         },
    //         pageSize: 10
    //     },
    //     pageable: {
    //         pageSizes: true,
    //         buttonCount: 5,
    //     },
    //     noRecords: true,
    //     messages: {
    //         noRecords: "没有相关记录！"
    //     },
    //     columns: [
    //         { field: "contractsName", title: "合约名称", template:'<span title="#:contractsName#" class="contractTile">#:contractsName#</span>' },
    //         { field: "contractTypeName", title: "合约方式" },
    //         { field: "subjectName", title: "公司名称" },
    //         { field: "usedPowerTypeName", title: "用电类型" },
    //         { field: "purchaseAmountValue", title: " 应购电量(万千瓦时)", template: '<span class="ele-used">#:purchaseAmountValue#</span>' }
    //     ]
    //  });
}
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
    }
}

