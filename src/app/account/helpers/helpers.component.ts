import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../+common/services/auth.service';

import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router'

import { environment } from '../../../environments/environment'

declare var $: any;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'helpers',
    templateUrl: './helpers.html',
    styleUrls: ['../../../assets/style/style.scss','./helpers.scss']
})
export class HelpersComponent {
    constructor(private location: Location, private authService: AuthService, private http: Http, private router: Router) {

    }

    index:number=0;

    switch(i){
        this.index=i;
    }

    ngOnInit() {
        $.showMenu(-1);
    }
}