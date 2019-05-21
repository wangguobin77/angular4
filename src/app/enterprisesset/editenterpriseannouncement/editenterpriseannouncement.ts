import { Input, Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
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


export class editenterpriseannouncement implements OnInit, OnDestroy {
    sub1;
    constructor(private router: Router, private authService: AuthService, private http: Http, private route: ActivatedRoute) {

    }

    currentUrl: string;

    enterpriseannouncementUrl: string;


    fnValidator(objID, pid) {
        if ($.trim($("#" + objID).val()) == "") {
            $("#" + pid).show();
            return false;
        } else {
            $("#" + pid).hide();
            return true;
        }
    }

    ngOnInit() {
        $.showSide(11005);

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




    Sumbit() {
        let id = this.route.snapshot.params['id'];
        if (!this.fnValidator("txtTitle", "pTitle")) {
            $("#txtTitle").focus();
            return false;
        }
        if (!this.fnValidator("editor", "pEditor")) {
            $("#editor").data("kendoEditor").focus();
            return false;
        }
        var Title = $("#txtTitle").val();
        var Content = $("#editor").data("kendoEditor").value();

        //企业公告新增编辑sellerCRMApi                        
        this.sub1 = this.authService.AuthPost(`${environment.sellerCRMApi}api/SellerAnnouncements/AddOrUpdateAnnouncements`, { id: id, Title: Title, Content: Content, Type: 1 })
            .subscribe((res) => {
                let data = res.json();
                if (data.return_code == "SUCCESS") {
                    window.location.href = "/enterprisesset/enterpriseannouncement";
                }
                else {
                    return;
                }
            }, (ex) => { console.log(ex) });
    }

    ngOnDestroy(){
        if(this.sub1!==undefined&&this.sub1!=null){this.sub1.unsubscribe();}
    }


}
