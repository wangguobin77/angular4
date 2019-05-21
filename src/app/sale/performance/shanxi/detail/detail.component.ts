import { Component, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { State, CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { AuthHttpService } from '../../../../+common/services/auth-http.service';
import { environment } from '../../../../../environments/environment';
import { DetailService } from './detail.service'
import { Router, ActivatedRoute } from '@angular/router';

import {
  GridDataResult,
  DataStateChangeEvent
} from '@progress/kendo-angular-grid';

declare var kendo: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'performancedetail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.scss']
})
export class DetailComponent {
  public view: Observable<GridDataResult>;
  public state: any = {
    skip: 0,
    take: 10
  };

  saleUserId: any;

  dateToString(v) {
    return kendo.toString(kendo.parseDate(v), 'yyyy/MM/dd HH:mm');
  }

  changeCustomer = {
    opened:false,
    customers:[],
    customerId:null,
    transferSaleId:null,
    close:()=>{
      this.changeCustomer.opened=false;
    },
    open: (id) => {
      let the = this.changeCustomer;
      the.customerId=id;
      the.opened = true;
      this.sub.push(this.auth.get(`${environment.sellerCRMApi}api/PerformanceSX/GetUserInfo`).subscribe(res => {
        let data = res.json();
        the.customers=data;
      }));
    },
    save:()=>{
      let the = this.changeCustomer;
      let req= {
        id:the.customerId,
        saleUserId:the.transferSaleId,
        transferSaleId:this.saleUserId
      }
      this.sub.push(this.auth.post(`${environment.sellerCRMApi}api/PerformanceSX/TransferSalesForApi`, req).subscribe(res => {
        let msg = res.json();
        alert('转移成功');
        the.opened=false;
        this.service.query(this.state, this.saleUserId);
        this.view = this.service;
      }));
    }
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.service.query(state, this.saleUserId);
  }
  private topData = {};
  constructor(public service: DetailService, private auth: AuthHttpService, private route: ActivatedRoute) {
    this.saleUserId = this.route.snapshot.params['id'];
    this.service.query(this.state, this.saleUserId);
    this.view = service;
  }
  private sub: Array<any> = [];
  ngOnDestroy() {
    for (let k of this.sub) {
      if (k !== undefined && k !== null) { k.unsubscribe(); }
    }
  }
}