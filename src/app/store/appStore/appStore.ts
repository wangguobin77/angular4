import { Component, OnInit , OnDestroy} from '@angular/core';
import { AppStoreService } from './appStore.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AuthHttpService } from '../../+common/services/auth-http.service';
import { AuthService } from '../../+common/services/auth.service';
import { environment } from '../../../environments/environment';
import { SideNavService } from '../sideNav/sideNav.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
@Component({
    selector: 'appStore',
    templateUrl: './appStore.html',
    styleUrls: ['./appStore.scss']
})
export class AppStoreComponent implements OnInit,OnDestroy {
    sub1;
    sub2;
    public shufflingPic = {
        'boxHeight': '200px',
        'btnShow': false,
        'pic': [
            {
                'imgUrl': 'assets/images/pic_bg1.png',
                'isShow': true
            }
        ]
    };
    public Data: any;
    private basicPackage = [];
    private valueAddedApp = [];
    private diandou = [];
    private tradingCenter = [];
    constructor(public service: AppStoreService,
        private http: Http, private auth: AuthHttpService,
        private base: AuthService,
        public sideNavService: SideNavService) {
        this.sideNavService.setWhichIsActive('appStore');
        const totleUrl = `${environment.appStoreApi}api/AppStore`;
        this.sub1=auth.get(totleUrl).subscribe((res) => {
            let result = res.json();
            for(let k of result[0].apps){
                if(k.name == '基础套餐'){
                    let index = result[0].apps.indexOf(k);
                    result[0].apps.splice(index,1);
                }
            }
            this.Data = result;
        })
    }
    unopen(): void {
        alert('未开放应用(详情页待开发)');
    }
    ngOnInit() {
        this.sub2=this.auth.get(`${environment.appStoreApi}api/TestClaims`).subscribe(function (res) {
            console.log(res)
        });
    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
    }
}
