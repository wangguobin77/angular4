import { Input, Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../+common/services/auth.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { environment } from '../../../environments/environment';
declare var $: any;
@Component({
	selector: 'newhallannouncement',
	templateUrl: './newhallannouncement.html',
	styleUrls: ['./newhallannouncement.scss']
})
export class newhallannouncement implements OnInit, OnDestroy {
	sub1;
	constructor(private router: Router, private authService: AuthService, private http: Http, private route: ActivatedRoute) {

	}
	ngOnInit() {
		let the = this;

		function fnValidator(objID, pid) {
			if ($.trim($("#" + objID).val()) == "") {
				$("#" + pid).show();
				return false;
			} else {
				$("#" + pid).hide();
				return true;
			}
		}


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



	fnValidator(objID, pid) {
		if ($.trim($("#" + objID).val()) == "") {
			$("#" + pid).show();
			return false;
		} else {
			$("#" + pid).hide();
			return true;
		}
	}

	addHallAnnouncement() {
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


		//营业厅公告新增
		this.sub1 = this.authService.AuthPost(`${environment.sellerCRMApi}api/SellerAnnouncements/AddOrUpdateAnnouncements`, { title: Title, content: Content, type: 2 })
			.subscribe((res) => {
				let result = res.json();
				if (result.result_code == "SUCCESS" && result.return_code == "SUCCESS") {
					window.location.href = "/enterprisesset/businesshallannouncement";
				}
				else {
					alert("保存失败");
					return;
				}
			}, (ex) => { console.log(ex) });
	}
	ngOnDestroy() {
		if (this.sub1 !== undefined && this.sub1 !== null) {
			this.sub1.unsubscribe();
		}
	}
}
