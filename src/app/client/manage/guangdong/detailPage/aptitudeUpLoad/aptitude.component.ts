import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileRestrictions, SelectEvent, ClearEvent, RemoveEvent, FileInfo } from '@progress/kendo-angular-upload';
import { AuthHttpService } from '../../../../../+common/services/auth-http.service';
import { environment } from '../../../../../../environments/environment';
declare var $: any;
@Component({
    selector: 'Aptitude-upload',
    templateUrl: './aptitude.component.html',
    styleUrls: ['./aptitude.scss']
})
export class Aptitude implements OnInit, OnDestroy {
    myRestrictions: FileRestrictions = {
        allowedExtensions: ['.jpg', '.png']
    };
    public events: string[] = [];
    public imagePreviews = [];
    private imgId = [];
    sub1;
    sub2;
    private postData = {
        sellerSubjectId: this.route.snapshot.params['id'],
        enterpriseCode: '',
        aptitudeImformatiuonList: [
            { aptitudeTitle: '', fileDataId: [], imageDataList: [] }
        ]

    }
    private isNew = true;
    private pageId: string;
    private opened = false;
    uploadSaveUrl = 'saveUrl';
    uploadRemoveUrl = 'removeUrl';
    constructor(private auth: AuthHttpService, public route: ActivatedRoute) {
    }
    public remove(upload, uid: string) {
        upload.removeFilesByUid(uid);
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
    private log(event: string, arg: any): void {
        this.events.unshift(`${event}`);
    }
    deleteImg(imgId) {
        const AptImgArr = this.postData.aptitudeImformatiuonList as any;
        for (let i = 0; i < AptImgArr.length; i++) {
            for (let j = 0; j < AptImgArr[i].imageDataList.length; j++) {
                if (AptImgArr[i].fileDataId[j] === imgId) {
                    this.postData.aptitudeImformatiuonList[i].imageDataList.splice(j, 1);
                    this.postData.aptitudeImformatiuonList[i].fileDataId.splice(j, 1);
                }
            }
        }
    }

    addNewAptitude() {
        this.postData.aptitudeImformatiuonList.push({ aptitudeTitle: '', fileDataId: [], imageDataList: [] });
    }

    onsubmit() {
        this.sub1 = this.auth.post(`${environment.sellerCRMApi}api/CertGD/SaveApt/`, this.postData)
            .subscribe((res) => {
                console.log(res.json());
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
        this.sub2 = this.auth.get(`${environment.sellerCRMApi}api/CertGD/AptEdit/?sellerSubjectId=${this.pageId}`)
            .subscribe((res) => {
                const result = res.json();
                if (result.edit) {
                    this.postData = result;
                    this.isNew = false;
                } else {
                    this.isNew = true;
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
