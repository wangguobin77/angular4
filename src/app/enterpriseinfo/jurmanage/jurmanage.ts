
import {Input,Component,Output,EventEmitter} from '@angular/core';
declare var $:any;
declare var kendo:any;
@Component({
  selector: 'jurmanage',
  templateUrl: './jurmanage.html',
  styleUrls:['./jurmanage.scss']
})
export class jurmanage{
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
	ngOnInit(){
		for(let k of this.menuList){
			if(this.whichIsActive == k.name){
				k.isActive = true;
			}
		};
		//列表框初始化
		$("#staffNoSelect").kendoGrid({
		  columns: [
		    {
		        template:'<input type="checkbox" id="#:id #" class="k-checkbox"><label class="k-checkbox-label select-it" for="#:id #"></label>#: name # <span class="ma-l20">#: branch #</span>',
		        field: "name",
		        title:"未选员工<span class='totleCount'>共<span id='selectCount'>0</span>项</span>"
		    }
		  ],
		  filterable: {
		      mode: "row"
		  },
		 dataSource: [
		 	{ name: "Jane" ,id:1,branch:"市场部"},
		 	{ name: "John" ,id:2,branch:"市场部"},
		 	{ name: "John" ,id:3,branch:"市场部"}]
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

		//添加移出按钮初始化

		$(document).on("click",".select-all",function(){
			if (!$(this).siblings("input").prop("checked")) {
				$(this).parents(".bot").siblings().find("input[type=checkbox]").attr("checked","checked");
				verifySelectAll.changeCount(this);
			}else{
				$(this).parents(".bot").siblings().find("input[type=checkbox]").attr("checked",false);
				verifySelectAll.changeCount(this);
			}
		})

		//有一个是未选中则使全选为未选中状态
		var verifySelectAll = {
			init:function(){
				this.bindEvent();
				this.selectedCount();
			},
			bindEvent:function(){
				var self = this;
				$(document).on("click",".select-it",function(){
					var _this = this;
					setTimeout(function(){
						var $input = $(_this).parents("tbody").find("input[type=checkbox]");
						 self.verifyIt($input,_this);
					},100);
				})
			},
			verifyIt:function(allInput,self){
				var m = 0;
				for(var i = 0;i < allInput.length;i ++){
					if ($(allInput[i]).prop("checked")) {
						m ++;
					}
				}
				if (m <= (allInput.length - 1)) {
					$(self).parents(".select-box").find(".bot").find("input").attr("checked",false);
				}else{
					$(self).parents(".select-box").find(".bot").find("input").attr("checked",true);
				}
			},
			selectedCount:function(){
				var _this = this;
				$(document).on("click",".select-box tbody label",function(){
					_this.changeCount(this);
				});
			},
			changeCount:function(_this){
				setTimeout(function(){
					var m = 0;
					var $input = $(_this).parents(".select-box").find("tbody").find("input[type=checkbox]");
					for(var i = 0;i < $input.length;i ++){
						if ($($input[i]).prop("checked")) {
							m ++;
						}
					}
					$(_this).parents(".select-box").find(".all").children().text(m);
				},100)
			}
		}
		verifySelectAll.init();
		//添加和移出
		var addAndRemove = {
			init:function(){
				this.totalCount();
				this.addStaff();
				this.removeStaff();
			},
			totalCount:function(){
				$("#selectCount").text($("#staffNoSelect").find("tbody").find("tr").length);
				$("#selectedCount").text($("#staffSelected").find("tbody").find("tr").length);
			},
			addStaff:function(){
				var _this = this;
				$(document).on("click","#addStaff",function(){
					_this.changeDetail("staffNoSelect","staffSelected");
				})
			},
			removeStaff:function(){
				var _this = this;
				$(document).on("click","#removeStaff",function(){
					_this.changeDetail("staffSelected","staffNoSelect");
				})
			},
			changeDetail:function(addStaffId,removeStaffId){
				var $input = $("#"+addStaffId).find("input[type=checkbox]");
				var str = "";
				for(var i = 0;i < $input.length;i ++){
					if ($($input[i]).prop("checked")) {
						$($input[i]).attr("checked",false);
						$("#"+removeStaffId).find("tbody")[0].appendChild($($input[i]).parents("tr")[0]);
						$("#"+removeStaffId).siblings().find("input[type=checkbox]").attr("checked",false);
					}
				}
				this.totalCount();
				verifySelectAll.changeCount($("#selectCount")[0]);
				verifySelectAll.changeCount($("#selectedCount")[0]);
			}
		}
		addAndRemove.init();


		$(document).on("change",".select-box th input",function(){
			var _this = this;
			verifySelectAll.changeCount(this);
			setTimeout(function(){
				var $input = $(_this).parents(".select-box").find("tbody").find("input[type=checkbox]");
				 verifySelectAll.verifyIt($input,_this);
			},100);
		})
			}
			changeActive(event,i){
				let e = event.currentTarget;
				for(let k of this.menuList){
					k.isActive = false;
				}
				this.menuList[i].isActive = true;
			}




}