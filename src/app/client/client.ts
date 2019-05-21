import {Component} from '@angular/core';
declare var $:any;
@Component({
  selector: 'client-service',
  template: '<slidebar></slidebar><router-outlet></router-outlet>'
})
export class Cilent {
	ngAfterViewInit(){
        $.showSide(10101);
        $.showMenu(1);
    }
}