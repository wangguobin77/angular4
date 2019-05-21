import { Input, Component, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../+common/services/auth.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';


declare var $: any;
@Component({
    selector: 'detailenter',
    templateUrl: './detailenter.html',
    styleUrls: ['./detailenter.scss']
})


export class detailenter {
    constructor(private router: Router, private authService: AuthService, private http: Http, private route: ActivatedRoute) {

    }

    currentUrl: string;

    enterpriseannouncementUrl: string;

 


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

        $(document).on("click", "#btnSubmit", function () {
            var Title = $("#txtTitle").val();
            var FormatPublishDate = $("#formatPublishDate").val();
            var Content = $("#editor").value();

            //企业公告新增编辑sellerCRMApi
            $.ajax({
                type: "POST",
                url: `${environment.sellerCRMApi}api/SellerAnnouncements/AddOrUpdateAnnouncements`,
                data: { id: id, Title: Title, Content: Content ,FormatPublishDate:FormatPublishDate,Type:1},
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
