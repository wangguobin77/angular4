import { Injectable ,OnDestroy} from '@angular/core';
import { Http } from '@angular/http';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { toODataString,toDataSourceRequestString } from '@progress/kendo-data-query';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthHttpService } from '../../../../+common/services/auth-http.service';
import { environment } from '../../../../../environments/environment';

export abstract class ListService extends BehaviorSubject<GridDataResult> implements OnDestroy {
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
        const totleUrl = `${environment.sellerCRMApi}api/PerformanceGD/GetPerformanceList?${queryStr}`; //
   
        return this.auth
            .get(totleUrl)
            .map(response => response.json())
            //.map(response => response));
    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
    }
}


@Injectable()
export class DataService extends ListService {
    constructor(http: Http,auth:AuthHttpService) { super(http, "biddingForecast", auth); }
}