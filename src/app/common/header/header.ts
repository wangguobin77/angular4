import {Component} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'header-app',
  templateUrl: './header.html',
  styleUrls:['./header.less']
})
export class header {
	subMenu(thisNode){
		let personSet = document.getElementById("personSet");
		personSet.style.display = "block";
	}
	ngOnInit(){
		let personSetIcon = document.getElementById("personSetIcon");
		let personSet = document.getElementById("personSet");
		document.body.onclick = function(event){
			if(event.target != personSetIcon&&event.target != personSet){
				personSet.style.display = "none";
			}
		}
	}
}