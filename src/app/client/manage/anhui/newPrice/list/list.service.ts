import { Injectable,OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { toODataString,toDataSourceRequestString } from '@progress/kendo-data-query';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthHttpService } from '../../../../../+common/services/auth-http.service';
import { environment } from '../../../../../../environments/environment';


export abstract class NorthwindService extends BehaviorSubject<GridDataResult> implements OnDestroy {
    sub1;
    public pageId:any;
    public checkedArr=[];
    constructor(private auth:AuthHttpService) {
        super(null);
    }
    public query(state: any): void {
        this.sub1=this.fetch(state)
            .subscribe(x => super.next(x));
    }
    setData(data){
        for(let k of data){
            k.isDisabled = false;
            k.isChecked = false;
            if(this.checkedArr.length>=5){
                for(let j of this.checkedArr){
                    if(k.SalePackagesId == j){
                        k.isChecked = true;
                        k.isDisabled = false;
                        break;
                    }else{
                        k.isChecked = false;
                        k.isDisabled = true;
                    }
                }
            }else{
                for(let j of this.checkedArr){
                    if(k.SalePackagesId == j){
                        k.isChecked = true;
                        break;
                    }else{
                        k.isChecked = false;
                    }
                }
            }
        }
        return data;
    }
    private fetch(state: any): Observable<GridDataResult> {
        const queryStr = toDataSourceRequestString(state);
        const totleUrl = `${environment.sellerCRMApi}api/AHQuoteProgram/GetPackageListByClient?${queryStr}&id=${this.pageId}`;
         
        return this.auth
            .get(totleUrl)
            .map(response => response.json())
            .map(response => (<GridDataResult>{
                data: this.setData(response.Data),
                total: parseInt(response["Total"], 10)
            }));
    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
    }
}


@Injectable()
export class NewPriceService extends NorthwindService {
    constructor(auth:AuthHttpService) { super( auth); }
}
