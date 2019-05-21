import { Injectable, OnDestroy } from '@angular/core';
import { AuthHttpService } from '../../../../../+common/services/auth-http.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { toODataString, toDataSourceRequestString } from '@progress/kendo-data-query';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/map';

export abstract class NorthwindService extends BehaviorSubject<GridDataResult> implements OnDestroy {
    sub1;
    private BASE_URL = `${environment.sellerCRMApi}api/ContractManage/GetCustomerContractByIdList/`;
    public SellerSubjectID: string;
    constructor(private auth: AuthHttpService, private tableName: string) {
        super(null);
    }

    public query(state: any): void {
        this.sub1 = this.fetch(this.tableName, state)
            .subscribe(x => super.next(x));
    }

    private fetch(tableName: string, state: any): Observable<GridDataResult> {
        const queryStr = `take=${state.take}&skip=${state.skip}`;
        return this.auth
            .get(`${this.BASE_URL}?${queryStr}&sellerSubjectID=${this.SellerSubjectID}`)
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
export class ProductsService extends NorthwindService {
    constructor(auth: AuthHttpService) { super(auth, 'Products'); }
}

@Injectable()
export class ContractService extends NorthwindService {
    constructor(auth: AuthHttpService) { super(auth, 'Categories'); }
}
