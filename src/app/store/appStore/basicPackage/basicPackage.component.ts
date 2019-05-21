import { Component, OnInit ,OnDestroy} from '@angular/core';
import { AuthHttpService } from '../../../+common/services/auth-http.service';
import { environment } from '../../../../environments/environment';
import { SideNavService } from '../../sideNav/sideNav.service';
@Component({
    selector: 'basci-package',
    templateUrl: './basicPackage.component.html',
    styleUrls: ['./basicPackage.scss']
})
export class BasicPackage implements OnInit ,OnDestroy{
    sub1;
    sub2;
    basicPackageData = {};
    constructor(public auth: AuthHttpService, private sideNavService: SideNavService) {
        sideNavService.setWhichIsActive('appStore');
    }
    ngOnInit() {
        this.getData();
    }
    getData() {
        this.sub1=this.auth.get(`${environment.appStoreApi}api/BasicPackage`).subscribe((res) => {
            const result = res.json();
            this.basicPackageData = result;
        })
    }
    addToCart(appId) {
        this.sub2=this.auth.post(`${environment.appStoreApi}api/Cart`, [appId]).subscribe((res) => {
            this.getData();
        })
    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
    }
}
