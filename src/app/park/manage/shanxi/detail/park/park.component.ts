import { Component, Output, EventEmitter,OnDestroy } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthHttpService } from '../../../../../+common/services/auth-http.service';
import { environment } from '../../../../../../environments/environment';
import { DetailService } from '../detail.service';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';



import {
    FormGroup,
    FormControl
} from '@angular/forms';

declare var $: any;
@Component({
    selector: 'park',
    templateUrl: './park.component.html',
    styleUrls: ['./park.scss']
})
export class Park implements OnDestroy {
    sub1;sub2;
    // 弹框控制
    add:boolean=false;
    creat:boolean=false;
    edit:boolean=false;
    dellist:boolean=false;


     close(v) {
        this.add=false;
        this.creat=false;
        this.edit=false;
        this.dellist=false;
    }

    refresh() {
        this.add=false;
        this.creat=false;
        this.edit=false;
        this.dellist=false;
        $("#grid").data("kendoGrid").dataSource.filter("");
    }
    // 添加联系人
    addContent(e){
        e.preventDefault();
        this.add= true;                            
    }


    // 删除
    delContent(e){
        e.preventDefault();
        this.dellist=true;
    }


    public id: number;
    public basicInfo = {};
    public editInfo = {};
    public isEdit: boolean = false;
    private headers = new Headers({ 'Content-Type': 'application/json' });
    public CategoryName: Array<string> = [];
    public activate = new EventEmitter<string>();
    constructor(public auth: AuthHttpService, public route: ActivatedRoute, public http: Http, public service: DetailService) {
        service.setActive('park');
    }

    public resa: any;
    CategoryNameReady: boolean = false;
    baseInEdit() {
        if (!this.CategoryNameReady) {
            let CategoryNameUrl = `${environment.sellerCRMApi}api/Customer/GetCategoryFirst/`
            this.sub1=this.auth.get(CategoryNameUrl).subscribe((res) => {
                let result = res.json();
                for (let k in result) {
                    this.CategoryName.push(result[k].categoryName);
                }
                this.CategoryNameReady = true;
            })
        }
        this.isEdit = true;
    }
    submitBaseInfo() {
        console.log(this.basicInfo);
        console.log(this.editInfo);
        let clientUrl = `${environment.sellerCRMApi}api/Customer/ModifyCustomer/`;
        // this.auth.post(url,aa).subscribe((res)=>{
        //  console.log(res.json());
        // })
        this.http
            .post(clientUrl, JSON.stringify(this.editInfo), { headers: this.headers })
            .toPromise()
            .then(res => this.resa = res.json())
            .catch(this.handleError);
        Object.assign(this.basicInfo, this.editInfo);
        this.isEdit = false;
    }
    cancelBaseInfo() {
        this.isEdit = false;
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    ngOnInit() {
        $.showSide(10104);
        this.id = +this.route.snapshot.params['id'];
        this.service.id = this.id;
        this.service.isActive = true;
        let url = `api/SellerPark/GetSellerParkDetail/?id=${this.id}`;
        let totleUrl = `${environment.sellerCRMApi}${url}`;
        //let totleUrl = "http://localhost:6046/" + url;
        this.sub2=this.auth.get(totleUrl).subscribe((res) => {
            let result = res.json();
            result.createDate = result.createDate.replace("-", ".").replace("-", ".");
            this.basicInfo = result;
            Object.assign(this.editInfo, this.basicInfo);
        })



        var basicInformation = {
            init:function(){
                this.bindEvent();
            },

            bindEvent:function(){

                $(document).on("click","#baseInEdit",function(){
                    this.changeDetail();
                })
            },

            changeDetail:function(){
                $("#informationBox").hide();
                
                $("#infEditBox").show();
                var $editp = $("#infEditBox").find(".editp");
                $editp.each(function(){
                    if ($("#"+$(this).data("id")).text() == "未填写")return;
                    if($(this).data("id") == "industryText"){
                        return;
                    }
                    $(this).find("input").val($("#"+$(this).data("id")).text());
                })
            },
            saveDetail:function(){
                $("#informationBox").show();
                $("#infEditBox").hide();
                var $editp = $("#infEditBox").find(".editp");
                var $editp = $("#infEditBox").find(".editp");
                $editp.each(function(){
                    if($(this).data("id") == "industryText"){
                        $("#industryText").text($(this).find(".k-input").text());
                        return;
                    }
                    $("#"+$(this).data("id")).text($(this).find("input").val());
                })
            }
        }
        basicInformation.init();


        function onOK(){
            if(validatorT.validate()){
                return true;
            }
            return false;
        }

        //弹框dialog

        var str = '<form id="dialogForm">'
                +'<div class="dialog-content-box">'
                    +'<ul>'
                        +'<li>姓名<span class="color-red">*</span></li>'
                        +'<li><input type="text" id="userName" name="userName" required validationMessage="请输入姓名" maxlength="20" class="k-textbox"/></li>'
                        +'<li>职位</li>'
                        +'<li><input type="text" id="post" name="post" class="k-textbox" maxlength="20"></li>'
                        +'<li>联系方式<span class="color-red">*</span></li>'
                        +'<li><input type="text" id="phone" name="phone" class="k-textbox" pattern="^(\\d{3,4}[-])?\\d{5,15}$" required validationMessage="请输入电话"/></li>'
                        +'<li>备注</li>'
                        +'<li><input type="text" id="noteT" name="noteT" class="k-textbox" maxlength="20"></li>'
                        +'<li>名片</li>'
                        +'<li>'
                            +'<div class="demo-section k-content wide">'
                                +'<div class="wrapper">'
                                    +'<div id="products"></div>'
                                    +'</div>'
                                 +'</div>'
                            +'</div>'
                            +'<input name="files" id="files" type="file" />'
                        +'</li>'
                    +'</ul>'
                +'</div>'
            +'</form>'
            var dialog = $("#dialog");
            dialog.kendoDialog({
                width: "450px",
                title: "新增联系人",
                closable: true,
                modal: false,
                content: str,
                actions: [
                    { text: '取消'},
                    { text: '确认', primary: true, action: onOK,className:"a-button"}
                ]
            });

        var validatorT = $("#dialogForm").kendoValidator({
            validate: function (e) {
            }
        }).data("kendoValidator");



        //联系人edit
        var contractEdit = {
            str:"",
            init:function(){
                this.bindEvent();
            },
            bindEvent:function(){
                $(document).on("click",".edit-list",function(){
                    dialog.data("kendoDialog").open();
                    var $tr = $(this).parents("tr");
                    $("#userName").val($tr.find(".userName").text());
                    $("#post").val($tr.find(".post").text());
                    $("#phone").val($tr.find(".phone").text());
                    $("#noteT").val($tr.find(".noteT").text());
                })
                $(document).on("click",".del-list",function(){
                 $(this).parents("tr").remove();
                })
            },
        }


        //kendo表格

            // contractEdit.init();

            var str = '<span class="userName">张全蛋</span>'
                        +'<span class="post">业务经理</span>'
                        +'<span class="phone">135465415456</span>'
                        +'<span class="border-0 noteT" title="文字文字文字文字文字文字文字文字">文字文字文字文字文字文字文字文字</span>'
                        +'<div class="color-9">'
                            +'<i class="iconfont icon-dingdan ma-r10 cur-p edit-list"></i>'
                            +'<i class="iconfont icon-shanchu1 cur-p del-list"></i>'
                        +'</div>'
            //$("#grid").kendoGrid({
            //    dataSource: {
            //        data: products,
            //        pageSize: 5
            //    },
            //    pageable: {
            //       pageSizes: true,
            //       buttonCount: 5
            //   },
            //   noRecords: true,
            //   messages: {
            //       noRecords: "There is no data on current page"
            //   },
            //    columns: [
            //        { field: "ProductName", title: "重要联系人",template:str},
            //        { field: "ProductName", title: "重要联系人",template:str},
            //        { field: "ProductName", title: "重要联系人",template:str},
            //    ]
            //});







    }
      ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
    }

}