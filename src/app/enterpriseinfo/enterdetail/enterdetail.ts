 import { Input, Component, Output, EventEmitter, ViewEncapsulation, Injectable, OnInit,OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { State } from '@progress/kendo-data-query';
import { Router, ActivatedRoute } from '@angular/router';

import { DialogModule } from '@progress/kendo-angular-dialog';

import { InputsModule } from '@progress/kendo-angular-inputs';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { AuthHttpService } from '../../+common/services/auth-http.service';

import { AuthService } from '../../+common/services/auth.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';



import {
    FormGroup,
    FormControl
} from '@angular/forms';


declare var $: any;
declare var kendo: any;


@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'enterdetail',
    templateUrl: './enterdetail.html',
    styleUrls: ['./enterdetail.scss']
})


export class enterdetail implements OnDestroy {
    sub1;
    constructor(private router: Router,private authService: AuthService, private http: Http) { }
    public data= {};



    ngOnInit() {
        let url = `api/SellerAnnouncements/ShowDetail`;
        let totalurl = `${environment.sellerCRMApi}${url}`;

        this.sub1=this.authService.AuthGet(totalurl).subscribe((res) => {
            let result = res.json();
            this.data = result;
            return(this.data);
        });
    }
        ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
    }
}