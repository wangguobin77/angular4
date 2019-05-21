import { Injectable } from '@angular/core';

import { AuthHttpService } from '../../../+common/services/auth-http.service';

import { GridDataResult } from '@progress/kendo-angular-grid';

import { toODataString, toDataSourceRequestString } from '@progress/kendo-data-query';

import { Observable } from 'rxjs/Observable';

import { environment } from '../../../../environments/environment';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/map';


export abstract class NorthwindService extends BehaviorSubject<GridDataResult> {


   private BASE_URL = `${environment.sellerCRMApi}api/CustomerCountAndAnalysisSX/GetCountAndAnalysisList/`;


   /*private BASE_URL = `http://10.96.227.222:8111/api/CustomerCountAndAnalysis/GetCountAndAnalysisList/`;*/
    public filters = '';
    public searchBoxContent = '';



    sub1;





   public query(state: any): void {
   let searchBoxContent = '';

        this.fetch(state).subscribe(x => super.next(x));

    }





    private fetch(state: any): Observable<GridDataResult> {
        let filter = '';
        let searchBoxContent = '';
        //debugger;
        if(this.filters != ''){
            filter = `&ContractStatus=${this.filters}`;
        }

        const queryStr = `take=${state.take}&skip=${state.skip}${filter}${this.searchBoxContent}`;



        console.dir(queryStr);

        return this.auth

            .get(`${this.BASE_URL}?${queryStr}`)

            .map(response => response.json())

            .map(response => (<GridDataResult>{

                data: response.data,

                total: parseInt(response['total'], 10)

            }));

    }

    constructor(private auth: AuthHttpService, private tableName: string) {

        super(null);

    }






}

@Injectable()

export class DataService extends NorthwindService {

    constructor(auth: AuthHttpService) { super(auth, 'Categories'); }

}