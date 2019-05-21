import { Injectable , OnDestroy} from '@angular/core';
import { Http } from '@angular/http';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { toODataString,toDataSourceRequestString } from '@progress/kendo-data-query';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../../environments/environment';
import {AuthHttpService} from '../../+common/services/auth-http.service'

import 'rxjs/add/operator/map';

export abstract class NorthwindService extends BehaviorSubject<GridDataResult> implements OnDestroy{
    sub1;
    constructor(private http: Http, private tableName: string,private auth:AuthHttpService) {
        super(null);
    }
    public query(state: any): void {
        this.sub1=this.fetch(this.tableName, state)
            .subscribe(x => super.next(x));
    }
    private fetch(tableName: string, state: any): Observable<GridDataResult> {
        const queryStr = toDataSourceRequestString(state);
        const totleUrl = `${environment.appStoreApi}api/Order?${queryStr}`;
        return this.auth
            .get(totleUrl)
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
    // constructor(http: Http) { super(http, "Products"); }

}

@Injectable()
export class OrderRecordService extends NorthwindService {
    constructor(http: Http,auth:AuthHttpService) { super(http, "orderRecord",auth); }
}