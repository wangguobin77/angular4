import {Component} from '@angular/core';
import { ActivatedRoute }  from '@angular/router';
import { FileState ,FileInfo} from '@progress/kendo-angular-upload';
declare var $:any;
@Component({
  	selector: 'Aptitude-upload',
  	templateUrl:'./aptitude.component.html',
  	styleUrls:['./aptitude.scss']
})
export class Aptitude {
	uploadSaveUrl: string = "saveUrl";
	uploadRemoveUrl: string = "removeUrl";
	public remove(upload, uid: string) {
	    upload.removeFilesByUid(uid);
	}
	myFiles: Array<FileInfo>;
	
}