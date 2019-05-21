import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthHttpService } from '../../../../../+common/services/auth-http.service';
import { environment } from '../../../../../../environments/environment';
declare var $: any;
@Component({
    selector: 'Apt-detail',
    templateUrl: './aptDetail.component.html',
    styleUrls: ['./aptDetail.scss']
})
export class AptDetail implements OnInit, OnDestroy {
    private pageId: string = this.route.snapshot.params['id'];
    private aptData = {};
    public shufflingPic = {
        'boxHeight': '400px',
        'btnShow': false,
        'pic': []
    };
    sub1;
    popShow = false;
    constructor(private auth: AuthHttpService, public route: ActivatedRoute) {
    }
    ngOnInit() {
        this.sub1 = this.auth.get(`${environment.sellerCRMApi}api/Cert/AptDetails/?sellerSubjectId=${this.pageId}`)
            .subscribe((res) => {
                console.log(res.json());

                this.aptData = res.json();
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
