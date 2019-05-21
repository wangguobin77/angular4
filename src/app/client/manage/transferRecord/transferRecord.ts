import {Component} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { State } from '@progress/kendo-data-query';
import 'rxjs/add/operator/map';
import {ClientTransferRecordService} from './clientTransferRecord.service'
import {
	GridDataResult,
	DataStateChangeEvent
} from '@progress/kendo-angular-grid';
declare var $:any;
@Component({
  	selector: 'transfer-record',
  	templateUrl: './transferRecord.component.html'
})
export class TransferRecord{
	ngAfterViewInit(){
        $.showSide(10101);
    }
	private gridData=[];
	public view: Observable<GridDataResult>;
	public logInfoView:Observable<GridDataResult>;
	public state: State = {
		skip: 0,
		take: 5
	};
	public loginfoState:State = {
		skip: 0,
		take: 5
	};
	constructor(
		private listService:ClientTransferRecordService
	){
		this.view = listService;
		this.listService.query(this.state);
	}
	public dataStateChange(state: DataStateChangeEvent): void {
		this.state = state;
		this.listService.query(state);
	}
}