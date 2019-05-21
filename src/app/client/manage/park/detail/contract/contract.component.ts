import { Component, OnDestroy, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { AuthHttpService } from '../../../../../+common/services/auth-http.service';
import { DetailService } from '../detail.service';
import { ContractService } from './contract.service';
import { Observable } from 'rxjs/Rx';
import { State, process } from '@progress/kendo-data-query';
declare var $: any;
import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';
@Component({
    selector: 'client-detai-contract-manage',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.scss']
})
export class ParkContract implements OnDestroy, OnInit{
    private gridData = [];
    private titleResult = {};
    sub1;
    public view: Observable<GridDataResult>;
    constructor(private service: DetailService, public route: ActivatedRoute, private auth: AuthHttpService, private contract: ContractService) {
        service.setActive('contract');
        contract.SellerSubjectID = route.snapshot.params["id"];
        this.view = contract;
        this.contract.query(this.state);
    }
    public state: State = {
        skip: 0,
        take: 10
    };
    public onStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.contract.query(state);
    }
    contractTypeName = ["长协", "竞价", "长协+竞价"];
    usedPowerType = ['工业', '工商业', '居民', '农业'];
    titleData = {};
    ngOnInit() {
        this.auth.get(
            `${environment.sellerCRMApi}api/SellerParkContract/SellerParkContract/?sellerSubjectId=${this.route.snapshot.params["id"]}`
        ).subscribe((res) => {
            console.log(res.json());
            this.titleData = res.json();
        })
    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe(); }
    }
}
