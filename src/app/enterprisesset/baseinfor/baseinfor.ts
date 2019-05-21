import { OnInit, Input, Component, ViewEncapsulation, Injectable, OnDestroy } from '@angular/core';

import { environment } from '../../../environments/environment';

import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { ActivatedRoute } from '@angular/router';

import { AuthHttpService } from '../../+common/services/auth-http.service';

import { Location } from '@angular/common';

import { AuthService } from '../../+common/services/auth.service';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';

import 'rxjs/add/operator/catch';

import { FileRestrictions, SelectEvent, ClearEvent, RemoveEvent, FileInfo } from '@progress/kendo-angular-upload';



import { State } from '@progress/kendo-data-query';

import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';

import {
    FormGroup,
    FormControl
} from '@angular/forms';

declare var $: any;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'baseinfor',
    templateUrl: './baseinfor.html',
    styleUrls: ['./sellerinformation.scss']
})
export class baseinfor implements OnInit, OnDestroy {

    sub1;
    sub2;
    sub3;
    sub4;
    sub5;





    uploadSaveUrl: string = "saveUrl";
    uploadRemoveUrl: string = "removeUrl";
    public remove(upload, uid: string) {
        upload.removeFilesByUid(uid);
    }
    myRestrictions: FileRestrictions = {
        allowedExtensions: [".jpg", ".png"]
    };
    public events: string[] = [];
    public imagePreviews = [];

    //上传保存图片
    public selectEventHandler(e: SelectEvent, imgArr, imgtype): void {
        let that = this;
        e.files.forEach((file) => {
            that.log(`File selected: ${file.name}`, 0);
            if (!file.validationErrors) {
                if (file.size / (1024 * 1024) > 2) {
                    alert("图片大小不能超过2M");
                    return;
                }
                let reader = new FileReader();
                reader.onload = function (ev: ProgressEvent) {
                    const tmp = ev.target as any;
                    let image = {
                        data: tmp.result as string,
                        fileName: file.name
                    };
                    //debugger;
                    if (imgtype == 6) {
                        var fileDataId = [];
                        var imageDataList = [];
                        imageDataList.push(image);
                        fileDataId.push(file.uid);
                        if (imgArr.length < 1) {
                            imgArr.push({ type: imgtype, fileDataId: fileDataId, imageDataList: imageDataList });
                        }
                        else {
                            imgArr[0].imageDataList = imageDataList;
                            imgArr[0].fileDataId = fileDataId;
                            imgArr[0].type = imgtype;
                        }
                        console.log(that.weixinSrc);
                    } if (imgtype == 5) {
                        var fileDataId = [];
                        var imageDataList = [];
                        imageDataList.push(image);
                        fileDataId.push(file.uid);
                        if (imgArr.length < 3) {
                            imgArr.push({ type: imgtype, fileDataId: fileDataId, imageDataList: imageDataList });
                        }
                    }


                };

                reader.readAsDataURL(file.rawFile);
            }
        });
    }


    private log(event: string, arg: any): void {
        this.events.unshift(`${event}`);
    }

    //删除图片
    deleteImg(filedata, imgId, typeid) {

        debugger;
        const AptImgArr = filedata as any;
        for (let i = 0; i < AptImgArr.length; i++) {
            for (let j = 0; j < AptImgArr[i].imageDataList.length; j++) {
                if (AptImgArr[i].fileDataId[j] === imgId) {
                    if (typeid === 3) {

                        this.weixinSrc.splice(i, 1);
                    } else if (typeid === 2) {
                        this.bannerSrc.splice(i, 1);
                    }
                }
            }
        }
    }



    //定义bannerData erweimaData
    private imgId = [];
    public item: any = {};

    public bannerSrc: any = {};
    public weixinSrc: any = [];
    public Id: string = "";

    public linceData = {};


    constructor(private location: Location, private authService: AuthService, private http: Http) {

    }

    public data = {};
    // public item = {};

    // lienceFormform 构造
    lienceForm: FormGroup = new FormGroup({
        taxNumber: new FormControl(),
        organizationCode: new FormControl(),
        businessLicense: new FormControl(),
    });

    //構建model
    lienceModel = {
        userName: "string",
        fullName: "string",
        id: 0,
        newPassword: "string",
        enabledUpdat: "string",

    };


    ngOnInit() {
        $.showSide(10401);
        this.sub1 = this.authService.AuthGet(`${environment.sellerCRMApi}api/BusinessHall/GetDomainInfo `).subscribe(function (res) {
            console.log(res.json())
            let data = res.json();
            let result = data.data;
            let subSiteName = result.subSiteName;
            if (subSiteName != "" && subSiteName != undefined) {
                $("#domainTxt").val(subSiteName);
                $("#domainTxt").attr("disabled", true);
                $("#btnOpen").css("display", "none");
            }
        });


        //读取营业厅信息
        let urlzcard = `${environment.sellerCRMApi}api/BusinessHall/BusinessBasicConfig`;
        this.sub2 = this.authService.AuthGet(urlzcard).subscribe((res) => {
            let result = res.json();
            let data = result.data;
            this.bannerSrc = data.bannerSrc;
            this.weixinSrc = data.weiXinSrc;
            this.Id = data.id;
            this.item = data;
            this.linceData = data;
            console.log(this.item);
        });

        $("#domainTxt").on('blur', function () {
            let pattern = /^(?!.*-$)(([0-9a-z][0-9a-z-]{1,63})|[0-9a-z]{2,63})$/;
            if (!pattern.test($("#domainTxt").val())) {
                $("#validate").html("请输入正确的域名");
                $("#validate").css("display", "block");
            }
            else {
                $("#validate").css("display", "none");
            }
        })



        $("#domain-btn").click(function () {
            $(this).addClass("active");
            $("#hallSetting-btn").removeClass("active");

            $("#domain").show();
            $("#hallSetting").hide();

        });

        $("#hallSetting-btn").click(function () {
            $(this).addClass("active");
            $("#domain-btn").removeClass("active");
            $("#domain").hide();
            $("#hallSetting").show();
        });


        $("#popPrompt").on("click", function () {
            $("#popPrompt").hide();
        })
    };



    //营业厅信息提交
    editclience(e) {
        e.preventDefault();

        //验证服务热线格式是否正确
        let pattern = /^(1[3,5,8,7]{1}[\d]{9})|(((400)-(\d{3})-(\d{4}))|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{3,7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/;
        if (!pattern.test($("#serviceNum").val())) {
            $("#pNum").show();
            $("#serviceNum").focus();
            return;
        }
        else {
            $("#pNum").hide();
        }


        let _this = this;
        _this.item.weiXinSrc = _this.weixinSrc;
        _this.item.bannerSrc = _this.bannerSrc;
        _this.sub3 = _this.authService.AuthPost(`${environment.sellerCRMApi}api/BusinessHall/SaveBusHallInfo `,
            _this.item).subscribe(function (res) {
                let result = res.json();
                console.log(result);
                if (result.result === 1) {
                    $("#prompt").html("保存成功！");
                    $("#popPrompt").show();
                } else {
                    $("#prompt").html("保存失败！");
                    $("#popPrompt").show();
                }
                console.log(result);
            }, (ex) => { console.log(ex) });
    }

    OpenDomain() {

        let domainValue = $("#domainTxt").val();
        let pattern = /^(?!.*-$)(([0-9a-z][0-9a-z-]{1,63})|[0-9a-z]{2,63})$/;
        if (pattern.test(domainValue)) {
            this.sub4 = this.authService.AuthPost(`${environment.sellerCRMApi}api/BusinessHall/EixtSubSiteName`, { subSiteName: domainValue }).subscribe((res) => {

                let data = res.json();
                debugger;
                if (data === 0) {
                    alert("域名已成功提交,我们正积极帮您配置中...... 可能需要您等待24-48小时域名才能使用。");
                    this.sub5 = this.authService.AuthPost(`${environment.sellerCRMApi}api/BusinessHall/SaveSubSiteName`, { subSiteName: domainValue }).subscribe((res) => {
                        console.log(res);
                        $("#validate").css("display", "none");
                        $("#btnOpen").text("开通中...");
                        $("#btnOpen").attr("disabled", true);
                        $("#domainTxt").attr("disabled", true);

                    })
                }
                else {
                    $("#validate").html("您填写的域名已被注册，请重新填写");
                    $("#validate").css("display", "block");
                    return;
                }
            })
        } else {
            $("#validate").html("请输入正确的域名");
            $("#validate").css("display", "block");

        }

    }

    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe(); }
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe(); }
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe(); }
        if (this.sub4 !== undefined && this.sub4 !== null) { this.sub4.unsubscribe(); }
        if (this.sub5 !== undefined && this.sub5 !== null) { this.sub5.unsubscribe(); }
    }
}

