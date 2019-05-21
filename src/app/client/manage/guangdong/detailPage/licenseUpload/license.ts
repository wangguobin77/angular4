import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileRestrictions, SelectEvent, ClearEvent, RemoveEvent, FileInfo } from '@progress/kendo-angular-upload';
import { AuthHttpService } from '../../../../../+common/services/auth-http.service';
import { environment } from '../../../../../../environments/environment';
@Component({
    selector: 'license-upload',
    templateUrl: './license.component.html',
    styleUrls: ['./license.scss']
})
export class LicenseUpload implements OnInit, OnDestroy {
    // 上传
    public events: string[] = [];
    pageId: string;
    sub1;
    sub2;
    private opened = false;

    private licenseData = {
        sellerSubjectId: this.route.snapshot.params['id'],
        legalCode: '',
        businessCode: '',
        isNew: false,
        orgCode: '',
        taxCode: '',
        certificates: {
            legalCodeInformation: {
                title: '',
                fileDataId: [],
                imageDataList: []
            },
            businessCodeInformation: {
                title: '',
                fileDataId: [],
                imageDataList: []
            },
            orgCodeInformation: {
                title: '',
                fileDataId: [],
                imageDataList: []
            },
            taxCodeInformation: {
                title: '',
                fileDataId: [],
                imageDataList: []
            }
        }
    }
    constructor(private auth: AuthHttpService, public route: ActivatedRoute) { };

    private log(event: string, arg: any): void {
        this.events.unshift(`${event}`);
    }
    public selectEventHandler(e: SelectEvent, imgArr): void {
        const that = this;
        e.files.forEach((file) => {
            that.log(`File selected: ${file.name}`, 0);
            if (!file.validationErrors) {
                const reader = new FileReader();
                reader.onload = function (ev: ProgressEvent) {
                    const tmp = ev.target as any;
                    const image = {
                        data: tmp.result as string,
                        fileName: file.name
                    };
                    imgArr.imageDataList.push(image);
                    imgArr.fileDataId.push(file.uid);
                };

                reader.readAsDataURL(file.rawFile);
            }
        });
    }

    del(witch, imgId) {
        const AptImgArr = this.licenseData.certificates[witch].imageDataList;
        for (let i = 0; i < AptImgArr.length; i++) {
            if (this.licenseData.certificates[witch].fileDataId[i] === imgId) {
                this.licenseData.certificates[witch].imageDataList.splice(i, 1);
                this.licenseData.certificates[witch].fileDataId.splice(i, 1);
            }
        }
    }
    deleteImg(witch, id) {
        switch (witch) {
            case 1:
                this.del('legalCodeInformation', id);
                break;
            case 2:
                this.del('businessCodeInformation', id);
                break;
            case 3:
                this.del('orgCodeInformation', id);
                break;
            case 4:
                this.del('taxCodeInformation', id);
                break;
            default:
                // code...
                break;
        }
    }
    switchChange() {
        if (this.licenseData.isNew) {
            this.licenseData.certificates.orgCodeInformation.fileDataId = [];
            this.licenseData.certificates.orgCodeInformation.imageDataList = [];
            this.licenseData.certificates.taxCodeInformation.fileDataId = [];
            this.licenseData.certificates.taxCodeInformation.imageDataList = [];
            this.licenseData.orgCode = '';
            this.licenseData.taxCode = '';
        }
    }
    onSubmit() {
        this.sub1 = this.auth.post(`${environment.sellerCRMApi}api/CertGD/SaveCert/`, this.licenseData)
            .subscribe((res) => {
                const result = res.json();
                if (result.return_code === 'SUCCESS') {
                    this.opened = true;
                } else {
                    alert('保存失败');
                }
            })
    }
    ngOnInit() {
        this.pageId = this.route.snapshot.params['id'];
        this.sub2 = this.auth.get(`${environment.sellerCRMApi}api/CertGD/CertEdit/?sellerSubjectId=${this.pageId}`)
            .subscribe((res) => {
                console.log(res.json());
                const result = res.json();
                if (result.certificates != null) {
                    result.sellerSubjectId = this.pageId;
                    this.licenseData = result;
                }
            })
    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe(); }
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe(); }
    }
    close() {
        this.opened = false;
    }
}
