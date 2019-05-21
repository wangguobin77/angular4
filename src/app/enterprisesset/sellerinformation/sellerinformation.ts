import { OnInit, Input, Component, ViewEncapsulation, Injectable ,OnDestroy} from '@angular/core';

import { environment } from '../../../environments/environment';

import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { ActivatedRoute } from '@angular/router';

import { AuthHttpService } from '../../+common/services/auth-http.service';

import { Location } from '@angular/common';

import { AuthService } from '../../+common/services/auth.service';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';

import 'rxjs/add/operator/catch';
import { FileRestrictions, SelectEvent, ClearEvent, RemoveEvent, FileInfo,SuccessEvent } from '@progress/kendo-angular-upload';


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
    selector: 'sellerinformation',
    templateUrl: './sellerinformation.html',
    styleUrls: ['./sellerinformation.scss']
})




export class sellerinformation implements OnDestroy {
    sub1;sub2;sub3;sub4;sub5;sub6;sub7;sub8;sub9;
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

    public selectEventHandler(e: SelectEvent, imgArr, imgtype): void {
        let that = this;
        e.files.forEach((file) => {
            that.log(`File selected: ${file.name}`, 0);
            if (!file.validationErrors) {
                let reader = new FileReader();
                reader.onload = function (ev: ProgressEvent) {
                    const tmp = ev.target as any;
                    let image = {
                        data: tmp.result as string,
                        fileName: file.name
                    };
                    if (imgtype == 1 || imgtype == 7 || imgtype == 8) {
                        imgArr.imageDataList = [];
                        imgArr.fileDataId = [];
                        imgArr.imageDataList.push(image);
                        imgArr.fileDataId.push(file.uid);

                        console.log(that.logoImg);
                        
                    } else if (imgtype == 2 || imgtype == 3 || imgtype == 4) {
                        var fileDataId = [];
                        var imageDataList = [];
                        imageDataList.push(image);
                        fileDataId.push(file.uid);
                        imgArr.push({ type: imgtype, fileDataId: fileDataId, imageDataList: imageDataList });
                    }


                };

                reader.readAsDataURL(file.rawFile);
            }
        });
    }
    private log(event: string, arg: any): void {
        this.events.unshift(`${event}`);
    }

    private imgId = [];
    //删除图片
    //deleteImg(imgId) {
    //    const AptImgArr = this.formData.sellerFileUpload as any;
    //    for (let i = 0; i < AptImgArr.length; i++) {
    //        for (let j = 0; j < AptImgArr[i].imageDataList.length; j++) {
    //            if (AptImgArr[i].fileDataId[j] == imgId) {
    //                this.formData.sellerFileUpload[i].imageDataList.splice(j, 1);
    //                this.formData.sellerFileUpload[i].fileDataId.splice(j, 1);
    //            }
    //        }
    //    }
    //}

    deleteImg(filedata, imgId,typeid) { 
        if(typeid==1){
            this.logoImg={ imageDataList:[],fileDataId:[],title: null, type: 1 };
            return;
        }
        const AptImgArr = filedata as any;
        for (let i = 0; i < AptImgArr.length; i++) {
            for (let j = 0; j < AptImgArr[i].imageDataList.length; j++) {
                if (AptImgArr[i].fileDataId[j] == imgId) {
                    if (typeid == 1) {
                        //this.formData.sellerFileUpload[i].imageDataList.splice(j, 1);
                        //this.formData.sellerFileUpload[i].fileDataId.splice(j, 1);
                    } else if (typeid == 2)
                    {
                        this.businessLicenseImg.splice(i, 1);
                    } else if (typeid == 3) {
                        this.organizationCodeImg.splice(i, 1);
                    } else if (typeid == 4) {
                        this.taxNumberImg.splice(i, 1);
                    }
                }
            }
        }
    }


    private gridData = [];
    formData: any = {};
    linceData: any = {};
    pptData: any = [];
    movieData: any = [];
    private areaCode = {};
    private province: Array<{ name: string, code: number }> = [];
    private cities: Array<{ name: string, code: number }> = [];
    businessLicenseImg: any = [];//营业执照图片
    organizationCodeImg: any = [];//组织机构图片
    taxNumberImg: any = [];//税务登记证图片
    logoImg:any={ imageDataList:[],fileDataId:[],title: null, type: 1 };

    refresh() { };


    //提交基本信息
    submit(e) {
        e.preventDefault();
        let __this = this;
        __this.formData.sellerFileUpload = [];
        __this.formData.sellerFileUpload.push(this.logoImg);

        this.sub1=__this.authService.AuthPost(`${environment.sellerCRMApi}api/SellerInformation/AddOrUpdateSellerInformation `,
            //__this.authService.AuthPost(`http://localhost:6045/api/SellerInformation/AddOrUpdateSellerInformation`,
            __this.formData).subscribe(function (res) {
                $("#confirm").css("display", "none");
                $("#confirm").attr("disabled", true);
                $("#confirm1").attr("disabled", true);
                $("#confirm2").attr("disabled", true);
                $("#confirm3").attr("disabled", true);

            });
    }


    //证照信息
    editclience(e) {
        e.preventDefault();
        let __this = this;

        __this.linceData.sellerFileUpload = [];
        __this.linceData.sellerFileUpload = __this.linceData.sellerFileUpload.concat(this.businessLicenseImg);
        __this.linceData.sellerFileUpload = __this.linceData.sellerFileUpload.concat(this.organizationCodeImg);
        __this.linceData.sellerFileUpload = __this.linceData.sellerFileUpload.concat(this.taxNumberImg);
        __this.linceData.picList = [];//清楚冗余数据
        this.sub2=__this.authService.AuthPost(`${environment.sellerCRMApi}api/SellerInformation/SaveSellerLicence `,
            //__this.authService.AuthPost(`http://localhost:6045/api/SellerInformation/SaveSellerLicence`,
            __this.linceData).subscribe(function (res) {

            });

    }

    public provincePlaceHolder: { name: string, code: string } = { name: "请选择", code: "" };
    public citiesPlaceHolder: { name: string, code: string } = { name: "请选择", code: "" };

    public editprovince: { name: string, code: number };
    public editcities: { name: string, code: number };


    constructor(private location: Location, private authService: AuthService, private http: Http) {

    }

    public data = {};
    public item = {};



    //構建model
    lienceModel = {
        userName: "string",
        fullName: "string",
        id: 0,
        newPassword: "string",
        enabledUpdat: "string",

    };


    ngOnInit() {
        $.showSide(11001);
        this.getProvince();//初始化省份
        //基本信息的api sellerCRMApi
        let url = `api/SellerInformation/GetBasicInfo`;
        let totalurl = `${environment.sellerCRMApi}${url}`;
        //let totalurl = `http://localhost:6045/api/SellerInformation/GetBasicInfo`;
        this.sub3=this.authService.AuthGet(totalurl).subscribe((res) => {
            let result = res.json();
            this.data = result;
            this.formData = result;
            let statuscode = result;
            let status = $("#status");
            let entry = $("#entry");

            let logoImgs = (<Array<any>>result.sellerFileUpload).filter(item => {
                return item.type == 1;
            });

            if(logoImgs!=null && logoImgs.length>0){
                this.logoImg = logoImgs[0];
            }

            if (result.areaFamily != "") {
                //省市赋值
              this.editprovince = { name: result.areaFamilyName.split(",")[0], code: result.provinceCode };
              this.editcities = { name: result.areaFamilyName.split(",")[1], code: result.cityCode };
            }
        });


        //证件信息的api
        let urlzj = `api/SellerInformation/GetLicence`;
        let urlz = `${environment.sellerCRMApi}${urlzj}`;
        //let urlz = `http://localhost:6045/api/SellerInformation/GetLicence`;
        this.sub4=this.authService.AuthGet(urlz).subscribe((res) => {
            let result = res.json();
            this.linceData = result;
            // console.dir(this.linceData);

            this.businessLicenseImg = (<Array<any>>result.sellerFileUpload).filter(item => {
                return item.type == 2;
            });
            this.organizationCodeImg = (<Array<any>>result.sellerFileUpload).filter(item => {
                return item.type == 3;
            });
            this.taxNumberImg = (<Array<any>>result.sellerFileUpload).filter(item => {
                return item.type == 4;
            });
            this.item = result;
        });

        //读取企业名片
        let urlcard = `api/SellerInformation/GetCard`;
        let urlzcard = `${environment.sellerCRMApi}${urlcard}`;
        //let urlzcard = `http://localhost:6045/api/SellerInformation/GetCard`;
        this.sub5=this.authService.AuthGet(urlzcard).subscribe((res) => {
            let result = res.json();
            this.pptData = (<Array<any>>result).filter(item => {
                return item.type == 7;
            });
            this.movieData = (<Array<any>>result).filter(item => {
                return item.type == 8;
            });
        });


        //企业名片
        let data = [
            "12 Angry Men",
            "Il buono, il brutto, il cattivo.",
            "Inception",
            "One Flew Over the Cuckoo's Nest",
            "Pulp Fiction",
            "Schindler's List",
            "The Dark Knight",
            "The Godfather",
            "The Godfather: Part II",
            "The Shawshank Redemption"
        ];

        $("#province").kendoDropDownList({
            optionLabel: "--选择省市--"
        });

        $("#city").kendoDropDownList({
            optionLabel: "--选择城市--"
        });

        $("#amount").kendoNumericTextBox();

        var validator = $("#ticketsForm").kendoValidator().data("kendoValidator"),
            status = $(".status");


        $("form").submit(function (event) {
            event.preventDefault();
            if (validator.validate()) {
                status.text("Hooray! Your tickets has been booked!")
                    .removeClass("invalid")
                    .addClass("valid");
            } else {
                status.text("Oops! There is invalid data in the form.")
                    .removeClass("valid")
                    .addClass("invalid");
            }
        });

        $("#basic-btn").click(function () {
            $(this).addClass("active");
            $("#licence-btn").removeClass("active");
            $("#card-btn").removeClass("active");
            $("#Basic").show();
            $("#Licence").hide();
            $("#card").hide();
        });

        $("#licence-btn").click(function () {
            $(this).addClass("active");
            $("#basic-btn").removeClass("active");
            $("#card-btn").removeClass("active");
            $("#Basic").hide();
            $("#Licence").show();
            $("#card").hide();
        });


        $("#card-btn").click(function () {
            $(this).addClass("active");
            $("#basic-btn").removeClass("active");
            $("#licence-btn").removeClass("active");
            $("#Basic").hide();
            $("#Licence").hide();
            $("#card").show();
        });






        var initTips = "";
        if (initTips != '') {
            alert(initTips);
        }


        //提交
        function validateForm() {
            var SellerName = $("#SellerName").val();
            var AreaFamily = $("#province").val() + "," + $("#city").val();
            var AreaFamilyName = $("#province").find("option:selected").text() + "," + $("#city").find("option:selected").text();
            $("#AreaFamily").val(AreaFamily);
            $("#AreaFamilyName").val(AreaFamilyName);
            var form = new FormData($("#ticketsForm")[0]);
            $.ajax({
                type: "POST",
                url: '${environment.sellerCRMApi}api/SellerInformation/GetBasicInfo',
                data: { SellerName: SellerName },
                async: false,
                success: function (result) {
                    if (result == "1") {
                        $.ajax({
                            type: "POST",
                            url: '/SellerInformation/AddOrUpdateSellerInformation',
                            cache: false,
                            processData: false,
                            contentType: false,
                            data: form,
                            async: false,
                            success: function (result) {
                                if (result == "1") {
                                    window.location.href = "/sellerinformation/licence?type=1";
                                }
                                else {
                                    //alert(objResult.ReturnMessage);
                                    return false;
                                }
                            }
                        });
                    } else if (result == "0") {
                        alert("公司已存在，请重新填写！");
                        $("#SellerName").focus()
                        return false;
                    }
                    else {
                        alert("验证公司名称失败，请联系管理员！");
                        return false;
                    }
                }
            });
            return false;
        }
        var _areaUrl = "http://tests.5spower.com/sellerapi/api/servicearea/childareas/";
        var ProvinceCode = "320000";
        var CityCode = "320100";
    }

    //城市联动
    getProvince() {
        let getProvinceUrl = `${environment.sellerCRMApi}api/Customer/GetProvince`;
        this.sub6=this.authService.AuthGet(getProvinceUrl).subscribe((res) => {
            let result = res.json();
            this.province = result;
        });
    }
    provinceChange(e) {
        this.cities = [];
        this.getCities(e.code);
        this.formData.areaFamily = e.code;
        this.formData.areaFamilyName = e.name;
    }
    getCities(provinceCode) {
        let citiesUrl = `${environment.sellerCRMApi}api/Customer/GetCities/?parentCode=${provinceCode}`;
        this.sub7=this.authService.AuthGet(citiesUrl).subscribe((res) => {
            let result = res.json();
            this.cities = result;
        });
    }
    citiesChange(e) {
        this.formData.areaFamily = this.formData.areaFamily + "," + e.code;
        this.formData.areaFamilyName = this.formData.areaFamilyName + "," + e.name;
    }

    public provinceDetail: { name: any, code: number };
    public city: { name: any, code: number };


    private postData = {
        "invoice": {
            "invoiceType": 0,
            "areaCode": {
                "proviceCode": 0,
                "cityCode": 0
            },
            "address": "string"
        }
    }

    onSubmit(m) {
        this.postData.invoice.areaCode.proviceCode = m.value.provinceDetail.code;
        this.postData.invoice.areaCode.cityCode = m.value.city.code;
        for (let k in m.value) {
            if (k != "provinceDetail" && k != "city") {
                this.postData.invoice[k] = m.value[k];
            }
        }
        this.sub8=this.authService.AuthPost(`${environment.appStoreApi}api/CartStep2`, this.postData).subscribe((res) => {
            console.log(res);
            let result = res.json();
        })
    }

    share={
        api:`${environment.sellerCRMApi}api/`,
        tcId:this.authService.currentTradingCenter.id,
    }

    // 企业名片/企业视频上传
    eCard = {
        ppt:{
            saveUrl:`${this.share.api}SellerImages/UploadPPT`,
            myRestrictions: {
                allowedExtensions:['ppt','pptx'],
                maxFileSize:1024*1024*50
            },
            success:(e: SuccessEvent, imgArr, imgtype)=> {
                if (e.operation === 'upload') {
                    let data = e.response.json();
                    imgArr.length = 0;
                    imgArr.push({ type: imgtype, fileDataId: data.fileId, imageDataList: [] });
                }
            },
            delete:(i)=>{
                (<Array<any>>this.pptData).splice(i,1);
            }
        },
        video:{
            saveUrl:`${this.share.api}SellerImages/UploadMovies`,
            myRestrictions: {
                allowedExtensions:['rmvb','rm','wmv','avi','mp4'],
                maxFileSize:1024*1024*500
            },
            success:(e: SuccessEvent, imgArr, imgtype)=> {
                if (e.operation === 'upload') {
                    let data = e.response.json();
                    imgArr.length = 0;
                    imgArr.push({ type: imgtype, fileDataId: data.fileId, imageDataList: [] });
                }
            },
            delete:(i)=>{
                (<Array<any>>this.movieData).splice(i,1);
            }
        },
        submit:(e)=>{
            e.preventDefault();
            let data = [].concat(this.pptData).concat(this.movieData);
            this.sub9=this.authService.AuthPost(`${this.share.api}SellerImages/ChangePPTorMovies`,data).subscribe(res=>{
                alert("保存成功");
            });
        }
    }
        ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe();}
        if (this.sub4 !== undefined && this.sub4 !== null) { this.sub4.unsubscribe();}
        if (this.sub5 !== undefined && this.sub5 !== null) { this.sub5.unsubscribe();}
        if (this.sub6 !== undefined && this.sub6 !== null) { this.sub6.unsubscribe();}
        if (this.sub7 !== undefined && this.sub7 !== null) { this.sub7.unsubscribe();}
        if (this.sub8 !== undefined && this.sub8 !== null) { this.sub8.unsubscribe();}
        if (this.sub9 !== undefined && this.sub9 !== null) { this.sub9.unsubscribe();}
    }
}