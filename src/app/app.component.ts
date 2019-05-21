import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
declare var config: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    ngOnInit() {
        config = environment;
    }
}
