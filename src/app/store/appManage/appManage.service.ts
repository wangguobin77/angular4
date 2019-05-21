import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class AppManageService{
      public postListURL = 'assets/script/product.json';

      constructor(public http:Http) { }
      
      public getPostList(){
        let url = this.postListURL;
        return this.http
                   .get(url)
                   .map((res:Response) => {
                       let result=res.json();
                       // console.log(result);
                       return result;
                   })
                   .catch((error:any) => Observable.throw(error || 'Server error'));
      }
}
