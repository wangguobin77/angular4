import {Input,Component,Output,EventEmitter} from '@angular/core';
import { SideNavService } from './sideNav.service';
import { AuthService } from '../../+common/services/auth.service';
@Component({
  selector: 'sideNav',
  templateUrl: './sideNav.html',
  styleUrls:['./sideNav.scss']
})
export class sideNav {
	@Input() 
	public whichIsActive:string;
	public menuList = [];
	constructor(public service:SideNavService,private base:AuthService){
		this.menuList = service.menuList;
		console.log(base.currentSeller);
		
	}
}