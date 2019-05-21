import { Injectable,OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { toODataString } from '@progress/kendo-data-query';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthService } from '../../../../+common/services/auth.service';

import{ environment } from '../../../../../environments/environment';

import 'rxjs/add/operator/map';

export abstract class NorthwindService extends BehaviorSubject<GridDataResult> implements OnDestroy {
    sub1;
    private BASE_URL: string = environment.sellerContractApi;

    constructor(private http: Http, private tableName: string, private authService: AuthService) {
        super(null);
    }

    public query(state: any): void {
        this.sub1=this.fetch(this.tableName, state)
            .subscribe(x => super.next(x));
    }

    private fetch(tableName: string, state: any): Observable<GridDataResult> {
        const queryStr = `take=${state.take}&skip=${state.skip}`;

        return this.authService
            .AuthGet(`${this.BASE_URL}?${queryStr}`)
            .map(response => response.json())
            .map(response => (<GridDataResult>{
                data: response.Data,
                total: parseInt(response["Total"], 10)
            }));
    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
    }
}

@Injectable()
export class ListService extends NorthwindService {
    constructor(http: Http, authService: AuthService) { super(http, "contracts", authService); }
   
    //public queryForProductName(ProductName: string, state?: any): void {
    //    this.query(Object.assign({}, state, {
    //        filter: {
    //            filters: [{
    //                field: "ProductName", operator: "contains", value: ProductName
    //            }],
    //            logic: "and"
    //        }
    //    }));
    //}
}