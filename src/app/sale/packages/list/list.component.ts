import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { State } from '@progress/kendo-data-query';
import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';

import { AuthService } from '../../../+common/services/auth.service';
import { DataService } from './list.service';
import { environment } from '../../../../environments/environment';

declare var $: any;

@Component({
    // encapsulation: ViewEncapsulation.None,
    selector: 'package-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.scss']
})

export class ListComponent implements OnInit, OnDestroy {

    constructor(public service: DataService, private auth: AuthService) {
        this.filters.reset();
        this.grid.init();
    }

    // 订阅对象集
    subscribes:Array<any>=[];

    // KendoGrid相关
    grid = {
        view: null,
        state: {
            skip: 0,
            take: 5
        },
        dataStateChange:(state: DataStateChangeEvent)=> {
            this.grid.state = state;
            this.grid.refresh();
        },
        refresh:()=>{
            this.subscribes.push(this.service.query(this.grid.state));
        },
        init:()=>{
            this.grid.view = this.service;
            this.grid.refresh();
        }
    };

    // 删除套餐
    delete={
        id:null,
        opened:false,
        open:(id)=>{
            this.delete.id=id;
            this.delete.opened = true;
        },
        close:()=>{
            this.delete.opened = false;
        },
        submit:()=>{
            this.subscribes.push(this.auth.AuthPost(`${environment.sellerCRMApi}api/SellPackages/Delete/${this.delete.id}`, null).subscribe(smsg => {
                this.delete.close();
                let msg = smsg.json();
                if(!msg.result){
                    alert(msg.message);
                }
                else{
                    this.grid.refresh();
                }
            }));
        }
    };

    // Grid条件过滤
    filters={
        fast:(v)=>{
            if(v!="" && v!=null){
                this.service.filter = {
                    filters: [{
                        field: "name", operator: "contains", value: v
                    }],
                    logic: "and"
                };
            }else{
                this.service.filter ={};
            }
            this.grid.refresh();
        },
        params:<any>{},
        isShow:false,
        toggle:()=>{
            this.filters.isShow = !this.filters.isShow;
        },
        reset:()=>{
            this.filters.params = {
                packageType:{
                    guarantee:false,
                    fix:false,
                    rate:false
                },
                contractType:{
                    two:false,
                    bid:false
                },
                purchaseAmount:{
                    min:null,
                    max:null
                }
            };
        },
        search:()=>{
            let params = this.filters.params;
            let filters = [];
            var filters1 = [];
            var filters2 = [];
            var filters3 = [];

            if(params.packageType.guarantee){
                filters1.push({ field: "packageType", operator: "eq", value: 1 });
            }
            if(params.packageType.fix){
                filters1.push({ field: "packageType", operator: "eq", value: 2 });
            }
            if(params.packageType.rate){
                filters1.push({ field: "packageType", operator: "eq", value: 3 });
            }

            if(params.contractType.two){
                filters2.push({ field: "contractType", operator: "eq", value: 1 });
            }
            if(params.contractType.bid){
                filters2.push({ field: "contractType", operator: "eq", value: 2 });
            }

            if(params.purchaseAmount.min!=null){
                filters3.push({ field: "minAmount", operator: "gte", value: params.purchaseAmount.min });
            }
            if(params.purchaseAmount.max!=null){
                filters3.push({ field: "maxAmount", operator: "lte", value: params.purchaseAmount.max });
            }
            // 合计
            if(filters1.length>0){
                filters.push({
                    logic: "or",
                    filters: filters1
                });
            }
            if(filters2.length>0){
                filters.push({
                    logic: "or",
                    filters: filters2
                });
            }
            if(filters3.length>0){
                filters.push({
                    logic: "and",
                    filters: filters3
                });
            }

            this.service.filter = {
                filters: filters,
                logic: "and"
            };

            this.grid.refresh();
        }
    };
    
    ngOnInit() {
        
    }
    
    ngOnDestroy(): void {
        this.subscribes.forEach(item => {
            if(item!=null && item!=undefined) item.unsubscribe();
        });
    }
}
