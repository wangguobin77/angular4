import { Observable } from 'rxjs/Rx';
import { Component, OnInit, Inject } from '@angular/core';

import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';

import { Product } from './model';
import { EditService } from './edit.service';
@Component({
  selector: 'client-service',
  templateUrl:'./power.component.html',
  styleUrls:['./power.scss'] 
})
export class Power {
	public view: Observable<GridDataResult>;
    public gridState: State = {
        sort: [],
        skip: 0,
        take: 10
    };

    private editService: EditService;
    private editDataItem: Product;
    private isNew: boolean;

    constructor(@Inject(EditService) editServiceFactory: any) {
        this.editService = editServiceFactory();
    }

    public ngOnInit(): void {
        this.view = this.editService.map(data => process(data, this.gridState));

        this.editService.read();
    }

    public onStateChange(state: State) {
        this.gridState = state;

        this.editService.read();
    }

    public addHandler() {
        this.editDataItem = new Product();
        this.isNew = true;
    }

    public editHandler({dataItem}) {
        this.editDataItem = dataItem;
        this.isNew = false;
    }

    public cancelHandler() {
        this.editDataItem = undefined;
    }

    public saveHandler(product: Product) {
        this.editService.save(product, this.isNew);

        this.editDataItem = undefined;
    }

    public removeHandler({dataItem}) {
        this.editService.remove(dataItem);
    }
}