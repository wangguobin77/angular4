import {Input, Component } from '@angular/core';

@Component({
    selector: 'shuffling',
    templateUrl: './shuffling.component.html',
    styleUrls: ['./shuffling.scss']
})
export class ShufflingComponent {
	@Input() 
	public shufflingPic={
		"boxHeight":"200px",
		"btnShow":true,
		"pic":[]
	};
	private pci = [];
	private whichShowItem:number = 0;
	ngOnInit(){
		this.pci = this.shufflingPic.pic;
		document.getElementById('shuffling').style.height = this.shufflingPic.boxHeight;
	}
	changePic(m):void{
		this.whichShowItem = m;
		for(let k of this.pci){
			k.isShow = false;
		}
		this.pci[m].isShow = true;
	}
	arrowLeft():void{
		let i = this.whichShowItem - 1;
		if(i < 0) {
			i = this.pci.length - 1;
		}
		this.changePic(i)
	}
	arrowRight():void{
		let i = this.whichShowItem + 1;
		if(i > this.pci.length-1) {
			i = 0;
		}
		this.changePic(i)
	}
}