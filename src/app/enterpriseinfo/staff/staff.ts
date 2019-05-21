import { Input, Component, Output, EventEmitter, ViewEncapsulation, Injectable, OnInit,OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { AuthHttpService } from '../../+common/services/auth-http.service';
import { AuthService } from '../../+common/services/auth.service';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AuthGuardService } from '../../+common/services/auth-guard.service';

import {
    FormGroup,
    FormControl
} from '@angular/forms';


declare var $: any;
@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'staff',
    templateUrl: './staff.html',
    styleUrls: ['./staff.scss']
})
export class staff implements OnDestroy {
    sub1;
 //弹框设置
    opened: boolean = false;

    close(v) {
        this.opened = false;
    }


    @Input()
    public whichIsActive: string;
    public menuList = [
        {
            "name": "sellerinfo",
            "text": "企业信息",
            "url": "/enterpriseinfo/sellerinfo",
            "icon": "iconfont icon-qiyexinxi",
            "isActive": false,
            "isNew": false
        },
        {
            "name": "staffmanage",
            "text": "员工管理",
            "url": "/enterpriseinfo/staffmanage",
            "icon": "iconfont icon-kehuguanli",
            "isActive": false,
            "isNew": false
        },
        {
            "name": "staff",
            "text": "角色管理",
            "url": "/enterpriseinfo/staff",
            "icon": "iconfont icon-jiaoseguanli1",
            "isActive": false,
            "isNew": false
        },
        {
            "name": "account",
            "text": "登录日志",
            "url": "/enterpriseinfo/account",
            "icon": "iconfont icon-denglurizhi",
            "isActive": false,
            "isNew": false
        },
        {
            "name": "enterpriseannounce",
            "text": "企业公告",
            "url": "/enterpriseinfo/enterpriseannounce",
            "icon": "iconfont icon-laba",
            "isActive": false,
            "isNew": false
        }
    ]

    constructor(private authService: AuthService, private http: Http) { }
    public datas = {};

    ngOnInit() {
        var __this = this;
        for (let k of this.menuList) {
            if (this.whichIsActive == k.name) {
                k.isActive = true;
            }
        };



    //角色列表
    $("#grid").kendoGrid({
            dataSource: {
                transport: {
                    read: function (f) {
                        var paras = new RequestOptions();
                        let url = `api/UserRoles/GetRoleUsersCount/34`;

                        let totalurl = `${environment.sellerCRMApi}${url}`;
                        //let totalurl = `http://10.96.227.247:98/api/UserRoles/GetRoleUsersCount/34`;

                        this.sub1=__this.authService.AuthGet(totalurl).subscribe((res) => {
                            let result = res.json();
                            this.datas = result.data;
                            f.success(result);

                        });

                    }

                },
            },
            pageable: false,
            noRecords: true,
            messages: {
                noRecords: "暂无角色数据"
            },
            columns: [
                { field: "formatName", title: "角色" },
                { field: "number", title: " 授权数" },
                { field: "roleLimits", title: " 权限" },
                { field: "roleDes", title: " 说明" },

                ],

        });


    //角色fenpei


    //列表框初始化
   $("#staffSelected").kendoGrid({
      columns: [
        {
            template:'<input type="checkbox" id="#:id #" class="k-checkbox"><label class="k-checkbox-label select-it" for="#:id #"></label>#: name # <span class="ma-l20">#: branch #</span>',
            field: "name",
            title:"已选员工<span class='totleCount'>共<span id='selectedCount'>0</span>项</span>"
        }
      ],
      filterable: {
          mode: "row",
      },
      dataSource: [ { name: "Jane" ,id:4,branch:"市场部"}, { name: "John" ,id:5,branch:"市场部"}]
});





    $("#staffSelected").kendoGrid({
          columns: [
            {
                template:'<input type="checkbox" id="#:id #" class="k-checkbox"><label class="k-checkbox-label select-it" for="#:id #"></label>#: name # <span class="ma-l20">#: branch #</span>',
                field: "name",
                title:"已选员工<span class='totleCount'>共<span id='selectedCount'>0</span>项</span>"
            }
          ],
          filterable: {
              mode: "row",
          },
          dataSource: [ { name: "Jane" ,id:4,branch:"市场部"}, { name: "John" ,id:5,branch:"市场部"}]
        });




















    }
        ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
    }
}