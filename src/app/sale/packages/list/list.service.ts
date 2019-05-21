import { Injectable, OnDestroy } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { toODataString, toDataSourceRequestString } from '@progress/kendo-data-query';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

import { AuthService } from '../../../+common/services/auth.service';
import { environment } from '../../../../environments/environment';

@Injectable()
export class DataService extends BehaviorSubject<GridDataResult> {
    constructor(private auth: AuthService) {
        super(null);
    }

    public filter: any = {};

    public query(state) {
        const data = toDataSourceRequestString(Object.assign({}, state, { filter: this.filter }));
        return this.auth
            .AuthGet(`${environment.sellerCRMApi}api/SellPackages`, data)
            .map(response => response.json())
            .map(response => (<GridDataResult>{
                data: response.data,
                total: parseInt(response['total'], 10)
            })).subscribe(x => super.next(x));
    }
}
