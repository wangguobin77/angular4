import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { dataDefault } from './data/default'
import { dataAH } from './data/anhui'
import { dataGD } from './data/guangdong'
import { dataSX } from './data/shanxi'

declare var $: any;

@Component({
    selector: 'slidebar',
    templateUrl: './slidebar.html',
    styleUrls: ['./slidebar.scss']
})
export class SlidebarComponent {

    //当前绑定的数据
    model = {
        sec: 0,
        thr: 0,
        menus: []
    };

    constructor(private auth: AuthService, private router: Router) { }
    ngOnInit() {
        var _the = this;
        $.showSide = function (id) {
            let menus = _the.model.menus;
            let firid = -1;

            _the.model.thr = id;

            for (const sec of _the.data) {
                let isSel = false;
                for (const child of sec.childs) {
                    if (child.id === id) {
                        isSel = true;
                        break;
                    }
                }
                if (isSel) {
                    firid = sec.parent;
                    _the.model.sec = sec.id;
                    break;
                }
            }
            if (firid !== -1) {
                menus.length = 0;
                for (const sec of _the.data) {
                    if (sec.parent === firid) {
                        menus.push(sec);
                    }
                }
            }
        }
    }

    get data() {
        if (this.auth.currentTradingCenter === undefined || this.auth.currentTradingCenter == null) {
            return dataDefault;
        } else if (this.auth.currentTradingCenter.id == 34) {
            return dataAH;
        } else if (this.auth.currentTradingCenter.id == 14) {
            return dataSX;
        } else if (this.auth.currentTradingCenter.id == 6) {
            return dataGD;
        } else {
            return dataDefault;
        }
    }

    switch(id) {
        this.model.sec = id;
    }
}
