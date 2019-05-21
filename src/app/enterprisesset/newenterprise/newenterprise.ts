import {Input,Component,Output,EventEmitter} from '@angular/core';
import { environment } from '../../../environments/environment';
declare var $:any;
@Component({
  selector: 'newenterprise',
  templateUrl: './newenterprise.html',
  styleUrls:['./newenterpriseannouncement.scss']
})
export class newenterprise{
	ngOnInit(){
		  function fnValidator(objID, pid) { 
		        if ($.trim($("#" + objID).val()) == "") { 
		            $("#" + pid).show(); 
		            return false; 
		        } else { 
		            $("#" + pid).hide(); 
		            return true; 
		        } 
		    }
		$(document).on("click", "#btnSubmit", function () { 
	        if (!fnValidator("txtTitle", "pTitle")){
	            $("#txtTitle").focus(); 
	            return false;
	        } 
	        if (!fnValidator("editor", "pEditor")){
	            $("#editor").data("kendoEditor").focus();
	            return false;
	        }
	        var Title = $("#txtTitle").val(); 
	        var Content =$("#editor").data("kendoEditor").value(); 
	        //var id = (Model.id);


            //企业公告新增编辑
	        $.ajax({
                type: "POST",
                url: `${environment.sellerCRMApi}api/SellerAnnouncements/AddOrUpdateAnnouncements`,
	            data: {Title: Title, Content: Content },
	            async: false,
	            success: function (result) {
                    if (result.result_code == "SUCCESS") {
                        window.location.href = "/enterprisesset/businesshallannouncement";
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
