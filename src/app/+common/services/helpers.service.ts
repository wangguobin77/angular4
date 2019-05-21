import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { environment } from '../../../environments/environment';

declare var $: any;
declare var kendo: any;

@Injectable()
export class HelpersService {
    constructor(private authService: AuthService, private http: Http) {

    }
    
}
