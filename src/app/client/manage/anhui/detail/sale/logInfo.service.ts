import { Injectable, OnDestroy } from '@angular/core';
import { AuthHttpService } from '../../../../../+common/services/auth-http.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { toODataString, toDataSourceRequestString } from '@progress/kendo-data-query';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

export abstract class NortService extends BehaviorSubject<GridDataResult> implements OnDestroy {

    private BASE_URL = `${environment.sellerCRMApi}api/Customer/GetClientOperateLogInfo/`;
    sub1;
    public SellerSubjectID: string;
    public createDate: string;
    constructor(private auth: AuthHttpService, private tableName: string) {
        super(null);
    }

    public query(state: any): void {
        this.sub1 = this.fetch(this.tableName, state)
            .subscribe(x => super.next(x));
    }
    private fetch(tableName: string, state: any): Observable<GridDataResult> {
        const queryStr = `take=${state.take}&skip=${state.skip}`;
        let createDate = '';
        if (this.createDate !== '' && this.createDate !== undefined && this.createDate != null) {
            createDate = `&createDate=${this.createDate}`;
        }
        return this.auth
            .get(`${this.BASE_URL}?SellerSubjectID=${this.SellerSubjectID}&${queryStr}${createDate}`)
            .map(response => response.json())
            .map(response => (<GridDataResult>{
                data: response.data,
                total: parseInt(response['total'], 10)
            }));
    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe(); }
    }
}

@Injectable()
export class LogInfoService extends NortService {
    constructor(auth: AuthHttpService) { super(auth, 'Categories'); }
}
