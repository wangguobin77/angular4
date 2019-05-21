import { OnInit, Input, Component, ViewEncapsulation, Injectable, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../+common/services/auth.service';

declare var $: any;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'sellerinfo',
    templateUrl: './sellerinfo.html',
    styleUrls: ['./sellerinfo.scss']
})

export class sellerinfo implements OnDestroy {
    sub1; sub2; sub3; sub4;
    
    constructor(private location: Location, private authService: AuthService) {

    }

    public shufflingPic = {
        'boxHeight': '400px',
        'btnShow': false,
        'pic': []
    };
    popShow = false;
    setPic(imgArr, n) {
        this.shufflingPic.pic = [];
        for (let i = 0; i < imgArr.length; i++) {
            this.shufflingPic.pic.push({
                'imgUrl': imgArr[i].imageDataList[0].data,
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

    public data = {};
    public cardItem = {};
    businessLicenseImg: any = [];//营业执照图片
    organizationCodeImg: any = [];//组织机构图片
    taxNumberImg: any = [];//税务登记证图片
    pptData: any = [];//ppt(企业名片)
    movieData: any = [];//视频（企业名片）
    public qyitem = {};

    ngOnInit() {
        $.showMenu(9);

        // 基本信息的api sellerCRMApi
        let url = `api/SellerInformation/GetBasicInfo `;
        let totalurl = `${environment.sellerCRMApi}${url}`;
        this.sub2 = this.authService.AuthGet(totalurl).subscribe((res) => {
            let result = res.json();
            this.data = result;
        });

        // 证件信息的api
        let urlzj = `api/SellerInformation/GetLicence`;
        let urlz = `${environment.sellerCRMApi}${urlzj}`;
        this.sub3 = this.authService.AuthGet(urlz).subscribe((res) => {
            let result = res.json();
            this.cardItem = result;
            this.businessLicenseImg = (<Array<any>>result.sellerFileUpload).filter(item => {
                return item.type == 2;
            });
            this.organizationCodeImg = (<Array<any>>result.sellerFileUpload).filter(item => {
                return item.type == 3;
            });
            this.taxNumberImg = (<Array<any>>result.sellerFileUpload).filter(item => {
                return item.type == 4;
            });
        });

        // 企业名片api
        /*let urlqy = `api/SellerInformation/GetCard`;
        let urlq = `${environment.sellerCRMApi}${urlqy}`;
        this.sub4 = this.authService.AuthGet(urlq).subscribe((res) => {
            let result = res.json();
            this.qyitem = result;
            this.pptData = (<Array<any>>result).filter(item => {
                return item.type == 7;
            });
            this.movieData = (<Array<any>>result).filter(item => {
                return item.type == 8;
            });
        });*/

    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe(); }
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe(); }
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe(); }
        if (this.sub4 !== undefined && this.sub4 !== null) { this.sub4.unsubscribe(); }
    }
}