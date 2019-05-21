import { Input, Component, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../+common/services/auth.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';


declare var $: any;
@Component({
    selector: 'editenterpriseannouncement',
    templateUrl: './editenterpriseannouncement.html',
    styleUrls: ['./editenterpriseannouncement.scss']
})


export class editenterpriseannouncement {
    constructor(private router: Router, private authService: AuthService, private http: Http, private route: ActivatedRoute) {

    }

    currentUrl: string;

    enterpriseannouncementUrl: string;

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


    ngOnInit() {
        function fnValidator(objID, pid) {
            if ($.trim($("#" + objID).val()) == "") {
                $("#" + pid).show();
                return false;
            } else {
                $("#" + pid).hide();
                return true;
            }
        }

        let _this = this;

        let id = _this.route.snapshot.params['id'];

        //加载公共详情
        $.ajax({
            type: "GET",
            url: `${environment.sellerCRMApi}api/SellerAnnouncements/ShowDetail`,
            data: { id: id },
            success: function (result) {
                if (result != null) {
                    $("#txtTitle").val(result.title);
                    $("#editor").data("kendoEditor").value(result.content);
                }
            }
        });

        $(document).on("click", "#btnSubmit", function () {
            if (!fnValidator("txtTitle", "pTitle")) {
                $("#txtTitle").focus();
                return false;
            }
            if (!fnValidator("editor", "pEditor")) {
                $("#editor").data("kendoEditor").focus();
                return false;
            }
            var Title = $("#txtTitle").val();
            var Content = $("#editor").data("kendoEditor").value();

            //企业公告新增编辑sellerCRMApi
            $.ajax({
                type: "POST",
                url: `${environment.sellerCRMApi}api/SellerAnnouncements/AddOrUpdateAnnouncements`,
                data: { id: id, Title: Title, Content: Content },
                async: false,
                success: function (result) {
                    if (result.result_code == "SUCCESS") {
                        window.location.href = "/enterprisesset/enterpriseannouncement";
                    }
                    else {
                        return;
                    }
                }
            });
        })


        $("#editor").kendoEditor({
            tools: [
                "bold",
                "italic",
                "underline",
                "strikethrough",
                "justifyLeft",
                "justifyCenter",
                "justifyRight",
                "justifyFull",
                "insertUnorderedList",
                "insertOrderedList",
                "indent",
                "outdent",
                "createLink",
                "unlink",
                "insertImage",
                "insertFile",
                "subscript",
                "superscript",
                "createTable",
                "addRowAbove",
                "addRowBelow",
                "addColumnLeft",
                "addColumnRight",
                "deleteRow",
                "deleteColumn",
                "viewHtml",
                "formatting",
                "cleanFormatting",
                "fontName",
                "fontSize",
                "foreColor",
                "backColor",
                "print"
            ]
        });
    }


}
