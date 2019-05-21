import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../../../../+common/services/auth-http.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { toODataString, toDataSourceRequestString } from '@progress/kendo-data-query';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/map';

export abstract class NorthwindService extends BehaviorSubject<GridDataResult> {
    private BASE_URL: string = `${environment.sellerCRMApi}api/SellerPark/GetParkTrackInfo/`;
    constructor(private auth: AuthHttpService, private tableName: string) {
        super(null);
    }

    public query(state: any): void {
        this.fetch(this.tableName, state)
            .subscribe(x => super.next(x));
    }
    public SellerSubjectID: string;
    private fetch(tableName: string, state: any): Observable<GridDataResult> {
        const queryStr = `take=${state.take}&skip=${state.skip}`;
        return this.auth
            .get(`${this.BASE_URL}?SellerSubjectID=${this.SellerSubjectID}&${queryStr}`)
            .map(response => response.json())
            .map(response => (<GridDataResult>{
                data: response.data,
                total: parseInt(response["total"], 10)
            }));
    }
}


@Injectable()
export class SaleService extends NorthwindService {
    constructor(auth: AuthHttpService) { super(auth, "Categories"); }
}