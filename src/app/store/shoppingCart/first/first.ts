import {Component,OnDestroy} from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Router} from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AuthHttpService } from '../../../+common/services/auth-http.service';
import { environment } from '../../../../environments/environment';
import {ShoppingCartService} from '../shoppingCart.service'

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
@Component({
  selector: 'first-cart',
  templateUrl: './first.component.html'
})
export class FirstStepCart implements OnDestroy {
    sub1;
    sub2;
    sub3;
    sub4;
    private gridData =[];//列表数据
    private totlePrice:number = 0;//总价
    private isSelectAll:boolean = false;//全选状态
    private totleCount:number = 0;//选中数量
    private opened:boolean = false;//弹窗控制
    private EBeans:number = 0;//电豆数量
    private isUsedEBeans:boolean = false;//是否使用电豆
    private deduction:number = 0;//抵扣
    private beansDeduction:number = 0;
    constructor(private http:Http,private auth:AuthHttpService,private router:Router,private shopService:ShoppingCartService){
        shopService.stepIsActive(1);
    }
    ngOnInit(){
        this.getData();
    }
    getData(){
        this.sub1=this.auth.get(`${environment.appStoreApi}api/Cart`).subscribe((res)=>{
            let result = res.json();
            for(let k of result.items){
                k.isChecked = false;
            }
            console.log(result);
            this.gridData = result.items;
        })
        this.sub2=this.auth.get(`${environment.appStoreApi}api/MyEBeans`).subscribe((res)=>{
            this.EBeans = res.json();
            console.log(res.json());
        })
    }
    onCountChange():void{
        this.setTotlePrice();
    }
    private m:number = 0;
    onChange():void{
        this.setTotlePrice();
        this.m = 0;
        for(let k of this.gridData){
            if(!k.isChecked){
                this.m = this.m+1;
            }
        }
        if(this.m>0) {
            this.isSelectAll = false;
        }else{
            this.isSelectAll = true;
        }
    }
    setTotlePrice():void{
        this.totlePrice = 0;
        this.totleCount = 0;
        this.deduction = 0;
        for(let k of this.gridData){
            if(k.isChecked){
                this.totlePrice += k.quantity*k.app.price;
                this.totleCount += 1;
                if(k.canUseEBeans) {
                    this.deduction += k.quantity*k.app.price;
                }
            }
        }
    }
    isSelectAllChange(e):void{
        if(e){
            for(let k of this.gridData){
                k.isChecked = true;
            }
        }else{
            for(let k of this.gridData){
                k.isChecked = false;
            }
        }
        this.setTotlePrice();
    }
    nextStep(){
        if(this.totleCount > 0) {
            let obj = {
                selectedItems :[],
                useEBeans :this.isUsedEBeans
            };
            for(let k of this.gridData){
                if(k.isChecked) {
                    obj.selectedItems.push({cartItemId:k.id,quantity:k.quantity});
                }
            }
            this.sub3=this.auth.post(`${environment.appStoreApi}api/Cart/NextStep`,obj).subscribe((res)=>{
                this.router.navigate(['/store/cart/second']);
            })
        }else{
            this.opened = true;
        }
    }
    public close(status) {
      this.opened = false;
    }

    //删除应用
    cartDelete(appId){
        let thisId = [];
        if(typeof appId == "string"){
            thisId.push(appId);
        }else{
            thisId = appId;
        }
        this.sub4=this.auth.delete(`${environment.appStoreApi}api/Cart/${JSON.stringify(thisId)}`).subscribe((res)=>{
            this.getData();
            this.totlePrice = 0;
            this.totleCount = 0;
            this.deduction = 0;
            this.isUsedEBeans = false;
            this.beansDeduction = 0;
        })
    }
    delAll(){
        let arr = [];
        for(let k of this.gridData){
            if(k.isChecked == true){
                arr.push(k.app.id);
            }
        }
        this.cartDelete(arr);
    }


    isUsedEBeansChange(e){
        if(e) {
            if(this.EBeans >= this.deduction) {
                this.beansDeduction = this.deduction;
            }else{
                this.beansDeduction = this.EBeans;
            }
        }else{
            this.beansDeduction = 0;
        }
    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
		if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe();}
        if (this.sub4 !== undefined && this.sub4 !== null) { this.sub4.unsubscribe();}
    }
}