import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AuthHttpService } from '../+common/services/auth-http.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class DataService {
    public postListURL = '';

    constructor(public http: AuthHttpService) { }

    public getPostList() {

        let url = this.postListURL;
        return this.http.get(url)
            .map((res: Response) => {
                let result = res.json();
                console.log(result);
                return result;
            })
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}
