import { Input, Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../+common/services/auth.service';
import { environment } from '../../../environments/environment';

declare var $: any;
@Component({
	selector: 'newenterpriseannouncement',
	templateUrl: './newenterpriseannouncement.html',
	styleUrls: ['./newenterpriseannouncement.scss']
})
export class newenterpriseannouncement implements OnInit, OnDestroy {

	sub1;
	constructor(private authService: AuthService) {

	}

	ngOnInit() {

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
	addAnnouncement() {
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


		//企业公告新增
		this.sub1 = this.authService.AuthPost(`${environment.sellerCRMApi}api/SellerAnnouncements/AddOrUpdateAnnouncements`, { title: Title, content: Content, type: 1 })
			.subscribe((res) => {
				let result = res.json();
				if (result.result_code == "SUCCESS" && result.return_code == "SUCCESS") {
					window.location.href = "/enterprisesset/enterpriseannouncement";
				}
				else {
					alert("保存失败");
					return;
				}
			}, (ex) => { console.log(ex) });
	}

	ngOnDestroy() {
		if (this.sub1 !== null && this.sub1 !== undefined) { this.sub1.unsubscribe(); }
	}

}
