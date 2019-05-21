import { Input, Component, Output, EventEmitter ,OnDestroy} from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../+common/services/auth.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';


declare var $: any;
@Component({
    selector: 'editoraddbusinesshallannouncement',
    templateUrl: './editoraddbusinesshallannouncement.html',
    styleUrls: ['./editoraddbusinesshallannouncement.scss']
})


export class editoraddbusinesshallannouncement implements OnDestroy {
    sub1;sub2;
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
        $.showSide(10402);

        $("#txtTitle").on('blur', function () {

            if ($.trim($("#txtTitle").val()) == "") {
                $("#pTitle").show();
                return false;
            } else {
                $("#pTitle").hide();
                return true;
            }
        });

        //editor

        $("#editor").on('blur', function () {
            if ($.trim($("#editor").val()) == "") {
                $("#pEditor").show();
                return false;
            } else {
                $("#pEditor").hide();
                return true;
            }
        });

        let _this = this;

        let id = _this.route.snapshot.params['id'];

        //获取公告详情
        this.sub1=this.authService.AuthGet(`${environment.sellerCRMApi}api/SellerAnnouncements/ShowDetail`, { id: id }).subscribe((res) => {
            let result = res.json();
            $("#txtTitle").val(result.title);
            $("#editor").data("kendoEditor").value(result.content);
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

        this.sub2=this.authService.AuthPost(`${environment.sellerCRMApi}api/SellerAnnouncements/AddOrUpdateAnnouncements`, { id: id, Title: Title, Content: Content, Type: 2 })
            .subscribe((res) => {
                let data = res.json();
                if (data.return_code == "SUCCESS") {
                    window.location.href = "/enterprisesset/businesshallannouncement";
                }
                else {
                    return;
                }
            }, (ex) => { console.log(ex) });

    }


    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
    }
}
