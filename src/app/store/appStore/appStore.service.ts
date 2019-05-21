import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class AppStoreService{
      public postListURL = `${environment.appStoreApi}api/AppStore`;

      constructor(public http:Http) { }
      
      public getData(){
        let url = this.postListURL;
        return this.http
                   .get(url)
                   .map((res:Response) => {
                       let result=res.json();
                       return result;
                   })
                   .catch((error:any) => Observable.throw(error || 'Server error'));
      }
}
