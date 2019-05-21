import { Injectable,OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { toODataString,toDataSourceRequestString } from '@progress/kendo-data-query';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../../environments/environment';

import 'rxjs/add/operator/map';

export abstract class NorthwindService extends BehaviorSubject<GridDataResult> implements OnDestroy {
    sub1;
    private BASE_URL: string = `${environment.sellerCRMApi}api/SellerPark/GetSellerParkList/`;
    //`${environment.sellerCRMApi}api/Customer/GetProvince`;
    public provinceCode:number;
    public citiesCode:number;
    constructor(private http: Http, private tableName: string) {
        super(null);
    }

    public query(state: any): void {
        this.sub1=this.fetch(this.tableName, state)
            .subscribe(x => super.next(x));
    }
    public filters:string = "";
    public searchBoxContent:string = "";
    private fetch(tableName: string, state: any): Observable<GridDataResult> {
        // const filters = {
        //     logic:'and',
        //     filters:this.filters
        //     // filters:[
        //     //     {field: "province", operator: "eq", value: this.provinceCode},
        //     //     {field: "cities", operator: "eq", value: this.citiesCode},
        //     // ]
        // }
        // state.filter=filters;
        // 
        const queryStr = `take=${state.take}&skip=${state.skip}${this.filters}${this.searchBoxContent}`;
        return this.http
            .get(`${this.BASE_URL}?${queryStr}`)
            .map(response => response.json())
            .map(response => (<GridDataResult>{
                data: response.data,
                total: parseInt(response["total"], 10)
            }));
    }
        ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
    }
}

@Injectable()
export class ProductsService extends NorthwindService {
    constructor(http: Http) { super(http, "Products"); }

    // public queryForCategory({ CategoryID }: { CategoryID: number }, state?: any): void {
    //     this.query(Object.assign({}, state, {
    //         filter: {
    //             filters: [{
    //                 field: "CategoryID", operator: "eq", value: CategoryID
    //             }],
    //             logic: "and"
    //         }
    //     }));
    // }

    // public queryForProductName(ProductName: string, state?: any): void {
    //     this.query(Object.assign({}, state, {
    //         filter: {
    //             filters: [{
    //                 field: "ProductName", operator: "contains", value: ProductName
    //             }],
    //             logic: "and"
    //         }
    //     }));
    // }

}

@Injectable()
export class DataService extends NorthwindService {
    constructor(http: Http) { super(http, "Categories"); }
}