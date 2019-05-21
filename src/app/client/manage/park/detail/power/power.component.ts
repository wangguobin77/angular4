import { Observable } from 'rxjs/Rx';
import { Component, AfterViewInit, Inject, OnDestroy } from '@angular/core';
import { State, process } from '@progress/kendo-data-query';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { DetailService } from '../detail.service';
import { PowerService } from './power.service';
import { AuthHttpService } from '../../../../../+common/services/auth-http.service';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';
declare var $: any;
@Component({
    selector: 'client-service',
    templateUrl: './power.component.html',
    styleUrls: ['./power.scss']
})
export class Power implements AfterViewInit, OnDestroy {
    public view: Observable<GridDataResult>;
    errorTip: string;
    errorTipIsShow = false;
    private datepickerMonth: any;
    public state: State = {
        skip: 0,
        take: 10
    };
    sub1;
    sub2;
    private active = true;
    private isNew = true;
    private Quantity = 0;
    private listId = 0;
    constructor(private service: DetailService, public route: ActivatedRoute, private auth: AuthHttpService, private power: PowerService) {
        service.setActive('power');
        power.SellerSubjectID = route.snapshot.params['id'];
        this.view = power;
        this.power.query(this.state);
    }
    closeForm() {
        this.errorTipIsShow = false;
        this.active = true;
    }
    addHandler() {
        this.listId = 0;
        this.active = false;
        this.Quantity = 0;
        this.datepickerMonth.value('');
    }
    editHandler({ dataItem }) {
        this.active = false;
        this.listId = dataItem.id;
        this.datepickerMonth.value(dataItem.recordDate);
        this.Quantity = dataItem.recordQuantity;
    }
    removeHandler({ dataItem }) {
        this.sub1 = this.auth.post(`${environment.sellerCRMApi}api/Customer/RemoveCustomElectricity`, { id: dataItem.id })
            .subscribe((res) => {
                console.log(res.json());
                if (res.json().return_code === 'SUCCESS') {
                    this.power.query({ skip: 0, take: 10 });
                }
            })
    }
    onSave(m) {
        if (this.datepickerMonth.value() === '' ||
            this.datepickerMonth.value() == null ||
            this.datepickerMonth.value() === undefined || !m.valid) {
            return;
        }
        const postData = {
            SellerSubjectId: this.route.snapshot.params['id'],
            'RecordYear': '',
            'RecordMonth': '',
            'Quantity': m.value.Quantity,
            id: this.listId
        };
        postData.RecordYear = this.datepickerMonth.value().getFullYear();
        postData.RecordMonth = this.datepickerMonth.value().getMonth() + 1;
        this.sub2 = this.auth.post(`${environment.sellerCRMApi}api/Customer/ModifyCustomElectricity`, postData)
            .subscribe((res) => {
                const result = res.json();
                if (result.return_code === 'SUCCESS') {
                    this.active = true;
                    this.power.query({ skip: 0, take: 10 });
                } else {
                    this.errorTip = result.return_msg;
                    this.errorTipIsShow = true;
                }

            })
    }
    ngAfterViewInit() {
        $('#datepickerMonth').kendoDatePicker({
            start: 'year',
            depth: 'year',
            format: 'yyyy MM'
        });
        this.datepickerMonth = $('#datepickerMonth').data('kendoDatePicker');
    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe(); }
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe(); }
    }

}
