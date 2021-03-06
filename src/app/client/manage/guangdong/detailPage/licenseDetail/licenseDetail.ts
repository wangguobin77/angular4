import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthHttpService } from '../../../../../+common/services/auth-http.service';
import { environment } from '../../../../../../environments/environment';
declare var $: any;
@Component({
    selector: 'license-detail',
    templateUrl: './licenseDetail.component.html',
    styleUrls: ['./licenseDetail.scss']
})
export class LicenseDetail implements OnInit, OnDestroy {

    private pageId: string = this.route.snapshot.params['id'];
    licenseData = {};
    legalCodeInformation = {};
    businessCodeInformation = {};
    orgCodeInformation = {};
    taxCodeInformation = {};
    public shufflingPic = {
        'boxHeight': '400px',
        'btnShow': false,
        'pic': []
    };
    popShow = false;
    sub1;
    constructor(private auth: AuthHttpService, public route: ActivatedRoute) {
    }
    ngOnInit() {
        this.sub1 = this.auth.get(`${environment.sellerCRMApi}api/CertGD/CertDetails/?sellerSubjectId=${this.pageId}`)
            .subscribe((res) => {
                console.log(res.json());

                const result = res.json();
                this.licenseData = result;
                this.legalCodeInformation = result.certificates.legalCodeInformation;
                this.businessCodeInformation = result.certificates.businessCodeInformation;
                this.orgCodeInformation = result.certificates.orgCodeInformation;
                this.taxCodeInformation = result.certificates.taxCodeInformation;
            })

    }

    setPic(imgArr, n) {
        this.shufflingPic.pic = [];
        for (let i = 0; i < imgArr.length; i++) {
            this.shufflingPic.pic.push({
                'imgUrl': imgArr[i].data,
                'isShow': i === n
            });
        }
        this.popShow = true;
    }

    hidePop(event) {
        if (event.target === document.getElementById('pop')) {
            this.popShow = false;
        }
    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe(); }
    }
}
