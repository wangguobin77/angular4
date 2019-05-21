import {Component} from '@angular/core';

@Component({
  selector: 'slideBar',
  templateUrl: './slideBar.html',
  styleUrls:['./slideBar.less']
})
export class slideBar {
	ngOnInit(){
	}
	public slideBarItems = [
		{
			itClass:"list",
			icon:"iconfont icon-kehuguanli",
			name:"概况",
			isSub:false,
			list:true,
			isShow:true
		},
		{
			itClass:"list active",
			icon:"iconfont icon-kehuguanli",
			name:"售电营销",
			isSub:true,
			isShow:true,
			list:true
		},
		{
			itClass:"content",
			icon:"iconfont icon-kehuguanli",
			list:false,
			isSub:false,
			isShow:true,
			sec:[
				{
					name:"工作台",
					isActive:true,
					url:"/workBench"
				},
				{
					name:"智能报价",
					isActive:false,
					url:"/service"
				}
			]

		},
		{
			itClass:"list",
			icon:"iconfont icon-kehuguanli",
			name:"售电营销",
			isSub:true,
			isShow:true,
			list:true
		},
		{
			itClass:"content",
			icon:"iconfont icon-kehuguanli",
			list:false,
			isShow:false,
			isSub:false,
			sec:[
				{
					name:"工作台",
					isActive:false,
					url:"/workBench"
				},
				{
					name:"智能报价",
					isActive:false,
					url:"/service"
				}
			]

		},
		{
			itClass:"list",
			icon:"iconfont icon-kehuguanli",
			name:"售电营销",
			isSub:false,
			isShow:true,
			list:true
		}
	]
	resetContentItem(m){
		for(var i = 0; i < this.slideBarItems.length;i ++){
			if(m !== i){
				this.slideBarItems[i].isShow = false;
				this.slideBarItems[i].itClass = this.slideBarItems[i].itClass.replace(" active","");
			}
		}
	}
	changeShowItem(index){
		if(!this.slideBarItems[index].list){
			alert("a");
		}else{
			this.resetContentItem(index);
			if(this.slideBarItems[index].itClass.match("active") === null){
				this.slideBarItems[index].itClass = this.slideBarItems[index].itClass + " active";
				if(this.slideBarItems[index+1].itClass.match("content") !== null){
					this.slideBarItems[index+1].isShow = true;
				}
			}else{
				if(this.slideBarItems[index+1].itClass.match("content") !== null){
					this.slideBarItems[index].itClass = this.slideBarItems[index].itClass.replace(" active","");
					this.slideBarItems[index+1].isShow = false;
				}
			}
		}
	}
}